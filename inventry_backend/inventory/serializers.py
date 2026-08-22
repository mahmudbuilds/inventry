from rest_framework import serializers
from .models import Category, Supplier, Product, StockMovement

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)
    total_stock = serializers.IntegerField(read_only=True)
    average_price = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Category
        fields = '__all__'



class SupplierSerializer(serializers.ModelSerializer):

    class Meta:
        model = Supplier
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    turnover_rate = serializers.FloatField(read_only=True)
    class Meta:
        model = Product
        fields = '__all__'
        
    read_only_fields = ('quantity_in_stock',)


class StockMovementSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = StockMovement
        fields = '__all__'
        
        
    read_only_fields = ('performed_by',)

