from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Category, Supplier, Product, StockMovement
from rest_framework.exceptions import ValidationError
from .serializers import (
    CategorySerializer, 
    SupplierSerializer, 
    ProductSerializer, 
    StockMovementSerializer, 
)
from django.db.models.functions import Coalesce
from django.db.models import F, Sum, Count, Avg, ExpressionWrapper, FloatField, Q, Value
from django.db import transaction

# Create your views here.

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class SupplierListCreateView(generics.ListCreateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]

class SupplierDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]


class StockMovementCreateView(generics.CreateAPIView):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic()
    def perform_create(self, serializer):
        product_id = serializer.validated_data['product'].id
        product = Product.objects.select_for_update().get(id=product_id)
        quantity = serializer.validated_data['quantity']
        movement_type = serializer.validated_data['movement_type']
        # update stock
        if movement_type == 'IN':
            product.quantity_in_stock = F("quantity_in_stock") + quantity
            
        elif movement_type == 'OUT':
            if product.quantity_in_stock < quantity:
                raise ValidationError({"quantity": "Not enough stock available for this movement."})
            product.quantity_in_stock = F("quantity_in_stock") - quantity
            
        product.save(update_fields=['quantity_in_stock'])
        serializer.save()


class StockMovementListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    
    
    

class StockMovementDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer

class LowStockAnalyticsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Product.objects.all().filter(quantity_in_stock__lte=F('reorder_level'))
    
class StockTurnoverAnalyticsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        
        return Product.objects.filter(
            quantity_in_stock__gt=0
        ).annotate(
            outbound_quantity=Coalesce(
                Sum(
                    'movements__quantity',
                    filter=Q(movements__movement_type='OUT'),
                ),
                Value(0),
            ),
        ).annotate(
            turnover_rate=ExpressionWrapper(
                F('outbound_quantity') * 1.0 / F('quantity_in_stock'),
                output_field=FloatField(),
            )
        ).filter(
            turnover_rate__gt=0
        ).order_by('-turnover_rate')
    
class CategorySummaryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.annotate(
            product_count=Count('products'),
            total_stock=Sum('products__quantity_in_stock'),
            average_price=Avg('products__unit_price')
        )

class MovementSummaryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StockMovementSerializer

    def get_queryset(self):
        return StockMovement.objects.all().order_by('-timestamp')

class LowStockByCategoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(quantity_in_stock__lte=F('reorder_level'), category_id=self.kwargs['category_id'])

class LowStockByCategoryAndSupplierView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(quantity_in_stock__lte=F('reorder_level'), category_id=self.kwargs['category_id'], supplier_id=self.kwargs['supplier_id'])