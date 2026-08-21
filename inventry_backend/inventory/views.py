from rest_framework import generics
from .models import Category, Supplier, Product, StockMovement
from rest_framework.exceptions import ValidationError
from .serializers import (
    CategorySerializer, 
    SupplierSerializer, 
    ProductSerializer, 
    StockMovementSerializer, 
)
from django.db.models import F, Sum, Count, Avg
from django.db import transaction

# Create your views here.

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SupplierListCreateView(generics.ListCreateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class SupplierDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class StockMovementCreateView(generics.CreateAPIView):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer

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
            
        product.save(update_fields=['quantity_in_stock', 'updated_at'])
        serializer.save()


class StockMovementListView(generics.ListAPIView):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    

class StockMovementDetailView(generics.RetrieveAPIView):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer

class LowStockAnalyticsView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.all().filter(quantity_in_stock__lte=F('reorder_level'))
    
class StockTurnoverAnalyticsView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        # We look at products currently in stock
        # We calculate turnover by comparing remaining stock to the reorder triggers
        return Product.objects.filter(
            quantity_in_stock__gt=0
        ).annotate(
            # Simple math: lower stock relative to reorder level means higher turnover
            turnover_rate=(F('reorder_level') * 1.0) / F('quantity_in_stock')
        ).filter(
            turnover_rate__gt=0
        ).order_by('-turnover_rate')
    
class CategorySummaryView(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.annotate(
            product_count=Count('products'),
            total_stock=Sum('products__quantity_in_stock'),
            average_price=Avg('products__unit_price')
        )

class MovementSummaryView(generics.ListAPIView):
    serializer_class = StockMovementSerializer

    def get_queryset(self):
        return StockMovement.objects.all().order_by('-timestamp')

class LowStockByCategoryView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(quantity_in_stock__lte=F('reorder_level'), category_id=self.kwargs['category_id'])

class LowStockByCategoryAndSupplierView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(quantity_in_stock__lte=F('reorder_level'), category_id=self.kwargs['category_id'], supplier_id=self.kwargs['supplier_id'])