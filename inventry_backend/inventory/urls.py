from django.contrib import admin
from django.urls import path
from . import views
from django.urls import path

urlpatterns = [
    # product routes
    path('products/', views.ProductListCreateView.as_view(), name='product-list'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    
    # category routes
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    
    # supplier routes
    path('suppliers/', views.SupplierListCreateView.as_view(), name='supplier-list'),
    path('suppliers/<int:pk>/', views.SupplierDetailView.as_view(), name='supplier-detail'),
    
    # stock movement routes
    path('movements/', views.StockMovementCreateView.as_view(), name='stock-movement-create'),
    path('movements/history/', views.StockMovementListView.as_view(), name='stock-movement-list'),
    path('movements/<int:pk>/', views.StockMovementDetailView.as_view(), name='stock-movement-detail'),

    # analytics route
    path('analytics/low-stock/', views.LowStockAnalyticsView.as_view(), name='low-stock-analytics'),
    path('analytics/stock-turnover/', views.StockTurnoverAnalyticsView.as_view(), name='stock-turnover-analytics'),
    path('analytics/category-summary/', views.CategorySummaryView.as_view(), name='category-summary'),
    path('analytics/movement-summary/', views.MovementSummaryView.as_view(), name='movement-summary'),
    path('analytics/dashboard-overview/', views.DashboardOverviewView.as_view(), name='dashboard-overview'),
    path('analytics/stock-flow/', views.StockFlowTrendsView.as_view(), name='stock-flow-trends'),
    path('analytics/low-stock/<int:category_id>/', views.LowStockByCategoryView.as_view(), name='low-stock-category'),
    path('analytics/low-stock/<int:category_id>/<int:supplier_id>/', views.LowStockByCategoryAndSupplierView.as_view(), name='low-stock-category-supplier'),
    
    
]