from rest_framework import serializers
from .models import Category, Supplier, Product, StockMovement


class MovementSummarySerializer(serializers.Serializer):
    total_in = serializers.IntegerField()
    total_out = serializers.IntegerField()
    net_change = serializers.IntegerField()
    total_movements = serializers.IntegerField()


class DashboardOverviewSerializer(serializers.Serializer):
    total_products = serializers.IntegerField()
    total_stock_units = serializers.IntegerField()
    low_stock_count = serializers.IntegerField()
    turnover_rate = serializers.FloatField()
    products_new_this_month = serializers.IntegerField()
    products_change_pct = serializers.FloatField()
    units_added_this_month = serializers.IntegerField()
    units_added_change_pct = serializers.FloatField()


class StockFlowPointSerializer(serializers.Serializer):
    date = serializers.DateField()
    stock_in = serializers.IntegerField()
    stock_out = serializers.IntegerField()


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)
    total_stock = serializers.IntegerField(read_only=True)
    average_price = serializers.FloatField(read_only=True)

    class Meta:
        model = Category
        fields = '__all__'


class SupplierSerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = Supplier
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    turnover_rate = serializers.FloatField(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True, allow_null=True)
    initial_stock = serializers.IntegerField(write_only=True, required=False, default=0)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ('quantity_in_stock',)


class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    performed_by_username = serializers.CharField(source='performed_by.username', read_only=True, allow_null=True)

    class Meta:
        model = StockMovement
        fields = '__all__'
        read_only_fields = ('performed_by',)
