from rest_framework import generics, status, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Category, Supplier, Product, StockMovement
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.contrib.auth import authenticate


from .serializers import (
    CategorySerializer,
    SupplierSerializer,
    ProductSerializer,
    StockMovementSerializer,
    MovementSummarySerializer,
    DashboardOverviewSerializer,
    StockFlowPointSerializer,
)
from .permissions import InventoryPermission
from django.db.models.functions import Coalesce, TruncDay
from django.db.models import F, Sum, Count, Avg, ExpressionWrapper, FloatField, Q, Value
from django.db import transaction
from django.utils import timezone
from datetime import datetime, timedelta

# Create your views here.


class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [InventoryPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "product_count", "total_stock", "average_price"]
    ordering = ["name"]

    def get_queryset(self):
        return Category.objects.annotate(
            product_count=Count("products"),
            total_stock=Coalesce(Sum("products__quantity_in_stock"), Value(0)),
            average_price=Coalesce(
                Avg("products__unit_price"), Value(0.0), output_field=FloatField()
            ),
        ).order_by("name")


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.annotate(
        product_count=Count("products"),
        total_stock=Coalesce(Sum("products__quantity_in_stock"), Value(0)),
        average_price=Coalesce(
            Avg("products__unit_price"), Value(0.0), output_field=FloatField()
        ),
    )
    serializer_class = CategorySerializer
    permission_classes = [InventoryPermission]


class SupplierListCreateView(generics.ListCreateAPIView):
    serializer_class = SupplierSerializer
    permission_classes = [InventoryPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "contact_email", "phone"]
    ordering_fields = ["name", "product_count"]
    ordering = ["name"]

    def get_queryset(self):
        return Supplier.objects.annotate(product_count=Count("products")).order_by(
            "name"
        )


class SupplierDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Supplier.objects.annotate(product_count=Count("products"))
    serializer_class = SupplierSerializer
    permission_classes = [InventoryPermission]


class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [InventoryPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "sku", "category__name", "supplier__name"]
    ordering_fields = [
        "id",
        "name",
        "sku",
        "unit_price",
        "quantity_in_stock",
        "reorder_level",
        "created_at",
    ]
    ordering = ["-id"]

    def get_queryset(self):
        queryset = Product.objects.all().select_related("category", "supplier")
        category_id = self.request.query_params.get("category")
        supplier_id = self.request.query_params.get("supplier")
        stock_status = self.request.query_params.get("stock_status")

        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if supplier_id:
            queryset = queryset.filter(supplier_id=supplier_id)
        if stock_status == "LOW":
            queryset = queryset.filter(
                quantity_in_stock__lte=F("reorder_level"), quantity_in_stock__gt=0
            )
        elif stock_status == "OUT":
            queryset = queryset.filter(quantity_in_stock__lte=0)
        elif stock_status == "OK":
            queryset = queryset.filter(quantity_in_stock__gt=F("reorder_level"))

        return queryset.order_by("-id")

    @transaction.atomic
    def perform_create(self, serializer):
        initial_stock = serializer.validated_data.pop("initial_stock", 0)
        product = serializer.save(quantity_in_stock=initial_stock)
        if initial_stock > 0:
            StockMovement.objects.create(
                product=product,
                movement_type="IN",
                quantity=initial_stock,
                performed_by=(
                    self.request.user if self.request.user.is_authenticated else None
                ),
                notes="Initial inventory setup",
            )


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all().select_related("category", "supplier")
    serializer_class = ProductSerializer
    permission_classes = [InventoryPermission]


class StockMovementCreateView(generics.CreateAPIView):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [InventoryPermission]

    @transaction.atomic()
    def perform_create(self, serializer):
        product_id = serializer.validated_data["product"].id
        product = Product.objects.select_for_update().get(id=product_id)
        quantity = serializer.validated_data["quantity"]
        movement_type = serializer.validated_data["movement_type"]
        # update stock
        if movement_type == "IN":
            product.quantity_in_stock = F("quantity_in_stock") + quantity

        elif movement_type == "OUT":
            if product.quantity_in_stock < quantity:
                raise ValidationError(
                    {"quantity": "Not enough stock available for this movement."}
                )
            product.quantity_in_stock = F("quantity_in_stock") - quantity

        product.save(update_fields=["quantity_in_stock"])
        serializer.save(performed_by=self.request.user)


class StockMovementPagination(PageNumberPagination):
    page_size = 20


class StockMovementListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StockMovementSerializer
    pagination_class = StockMovementPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["product__name", "product__sku", "notes", "performed_by__username"]
    ordering_fields = ["timestamp", "quantity", "movement_type"]
    ordering = ["-timestamp"]

    def paginate_queryset(self, queryset):
        # Dashboard requests use limit for a small unpaginated activity preview.
        if self.request.query_params.get("limit"):
            return None
        return super().paginate_queryset(queryset)

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)
        limit = self.request.query_params.get("limit")
        if limit:
            try:
                return queryset[: max(1, int(limit))]
            except ValueError:
                raise ValidationError({"limit": "Must be an integer."})
        return queryset

    def get_queryset(self):
        queryset = (
            StockMovement.objects.all()
            .select_related("product", "performed_by")
            .order_by("-timestamp")
        )
        product_id = self.request.query_params.get("product")
        movement_type = self.request.query_params.get("movement_type")
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        if movement_type:
            queryset = queryset.filter(movement_type=movement_type)

        return queryset


class StockMovementDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer


class LowStockAnalyticsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.all().filter(quantity_in_stock__lte=F("reorder_level"))


class StockTurnoverAnalyticsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):

        return (
            Product.objects.filter(quantity_in_stock__gt=0)
            .annotate(
                outbound_quantity=Coalesce(
                    Sum(
                        "movements__quantity",
                        filter=Q(movements__movement_type="OUT"),
                    ),
                    Value(0),
                ),
            )
            .annotate(
                turnover_rate=ExpressionWrapper(
                    F("outbound_quantity") * 1.0 / F("quantity_in_stock"),
                    output_field=FloatField(),
                )
            )
            .filter(turnover_rate__gt=0)
            .order_by("-turnover_rate")
        )


class CategorySummaryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.annotate(
            product_count=Count("products"),
            total_stock=Coalesce(Sum("products__quantity_in_stock"), Value(0)),
            average_price=Coalesce(
                Avg("products__unit_price"), Value(0.0), output_field=FloatField()
            ),
        ).order_by("name")


class MovementSummaryView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MovementSummarySerializer

    def get_object(self):
        aggregates = StockMovement.objects.aggregate(
            total_in=Sum("quantity", filter=Q(movement_type="IN")),
            total_out=Sum("quantity", filter=Q(movement_type="OUT")),
            total_movements=Count("id"),
        )
        total_in = aggregates["total_in"] or 0
        total_out = aggregates["total_out"] or 0
        return {
            "total_in": total_in,
            "total_out": total_out,
            "net_change": total_in - total_out,
            "total_movements": aggregates["total_movements"],
        }


class LowStockByCategoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(
            quantity_in_stock__lte=F("reorder_level"),
            category_id=self.kwargs["category_id"],
        )


class LowStockByCategoryAndSupplierView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(
            quantity_in_stock__lte=F("reorder_level"),
            category_id=self.kwargs["category_id"],
            supplier_id=self.kwargs["supplier_id"],
        )


def _pct_change(current, previous):
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return round((current - previous) / previous * 100, 1)


class DashboardOverviewView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DashboardOverviewSerializer

    def get_object(self):
        now = timezone.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_month_start = (month_start - timedelta(days=1)).replace(day=1)

        product_agg = Product.objects.aggregate(
            total_products=Count("id"),
            total_stock_units=Sum("quantity_in_stock"),
        )
        low_stock_count = Product.objects.filter(
            quantity_in_stock__lte=F("reorder_level")
        ).count()

        movement_agg = StockMovement.objects.aggregate(
            total_out=Sum("quantity", filter=Q(movement_type="OUT")),
            out_this_month=Sum(
                "quantity", filter=Q(movement_type="OUT", timestamp__gte=month_start)
            ),
            out_last_month=Sum(
                "quantity",
                filter=Q(
                    movement_type="OUT",
                    timestamp__gte=last_month_start,
                    timestamp__lt=month_start,
                ),
            ),
            in_this_month=Sum(
                "quantity", filter=Q(movement_type="IN", timestamp__gte=month_start)
            ),
            in_last_month=Sum(
                "quantity",
                filter=Q(
                    movement_type="IN",
                    timestamp__gte=last_month_start,
                    timestamp__lt=month_start,
                ),
            ),
        )
        products_this_month = Product.objects.filter(
            created_at__gte=month_start
        ).count()
        products_last_month = Product.objects.filter(
            created_at__gte=last_month_start, created_at__lt=month_start
        ).count()

        total_stock = product_agg["total_stock_units"] or 0
        total_out = movement_agg["total_out"] or 0

        return {
            "total_products": product_agg["total_products"],
            "total_stock_units": total_stock,
            "low_stock_count": low_stock_count,
            "turnover_rate": round(total_out / total_stock, 2) if total_stock else 0.0,
            "products_new_this_month": products_this_month,
            "products_change_pct": _pct_change(
                products_this_month, products_last_month
            ),
            "units_added_this_month": movement_agg["in_this_month"] or 0,
            "units_added_change_pct": _pct_change(
                movement_agg["in_this_month"] or 0, movement_agg["in_last_month"] or 0
            ),
        }


class StockFlowTrendsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StockFlowPointSerializer

    def get_queryset(self):
        days = self.request.query_params.get("days", "30")
        try:
            days = max(1, min(365, int(days)))
        except ValueError:
            raise ValidationError({"days": "Must be an integer."})

        today = timezone.localdate()
        start = timezone.make_aware(
            datetime.combine(today - timedelta(days=days), datetime.min.time())
        )
        return (
            StockMovement.objects.filter(timestamp__gte=start)
            .annotate(day=TruncDay("timestamp"))
            .values("day")
            .annotate(
                stock_in=Sum("quantity", filter=Q(movement_type="IN")),
                stock_out=Sum("quantity", filter=Q(movement_type="OUT")),
            )
            .order_by("day")
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(
            [
                {
                    "date": row["day"].date(),
                    "stock_in": row["stock_in"] or 0,
                    "stock_out": row["stock_out"] or 0,
                }
                for row in queryset
            ],
            many=True,
        )
        return Response(serializer.data)


class RegisterView(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not email or not password:
            return Response(
                {"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username taken"}, status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST
            )

        from django.contrib.auth.password_validation import validate_password

        try:
            validate_password(password)
        except ValidationError as exc:
            return Response(
                {"password": list(exc.messages)}, status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username, email=email, password=password
        )

        refresh = RefreshToken.for_user(user)

        response = Response(
            {"detail": "User registered successfully"}, status=status.HTTP_200_OK
        )

        set_auth_cookies(response, refresh, refresh.access_token)
        from django.middleware.csrf import get_token

        response.set_cookie(
            "csrftoken", get_token(request), samesite="Lax", secure=not settings.DEBUG
        )

        return response


def set_auth_cookies(response, refresh_token, access_token):
    response.set_cookie(
        "access_token",
        str(access_token),
        httponly=True,
        samesite="Lax",
        secure=not settings.DEBUG,
        path="/",
        max_age=24 * 60 * 60,
    )
    response.set_cookie(
        "refresh_token",
        str(refresh_token),
        httponly=True,
        samesite="Lax",
        secure=not settings.DEBUG,
        path="/",
        max_age=7 * 24 * 3600,
    )


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Ensure both username and password are submitted"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=username, password=password)

        if user is not None:
            # user is an authenticated User instance
            refresh = RefreshToken.for_user(user)
            response = Response(
                {"detail": "User logged in successfully"},
                status=status.HTTP_200_OK,
            )
            set_auth_cookies(response, refresh, refresh.access_token)
            return response
        else:
            return Response(
                {"error": "Invalid username or password. Please try again."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
