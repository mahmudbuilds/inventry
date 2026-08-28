from django.contrib import admin
from django.urls import path
from . import views
from django.urls import path

urlpatterns = [
    # product routes
    path('products/', views.ProductListCreateView.as_view(), name='product-list'),
    path('products', views.ProductListCreateView.as_view()),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:pk>', views.ProductDetailView.as_view()),
    
    # category routes
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list'),
    path('categories', views.CategoryListCreateView.as_view()),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('categories/<int:pk>', views.CategoryDetailView.as_view()),
    
    # supplier routes
    path('suppliers/', views.SupplierListCreateView.as_view(), name='supplier-list'),
    path('suppliers', views.SupplierListCreateView.as_view()),
    path('suppliers/<int:pk>/', views.SupplierDetailView.as_view(), name='supplier-detail'),
    path('suppliers/<int:pk>', views.SupplierDetailView.as_view()),
    
    # stock movement routes
    path('movements/', views.StockMovementCreateView.as_view(), name='stock-movement-create'),
    path('movements', views.StockMovementCreateView.as_view()),
    path('movements/history/', views.StockMovementListView.as_view(), name='stock-movement-list'),
    path('movements/history', views.StockMovementListView.as_view()),
    path('movements/<int:pk>/', views.StockMovementDetailView.as_view(), name='stock-movement-detail'),
    path('movements/<int:pk>', views.StockMovementDetailView.as_view()),

    # analytics route
    path('analytics/low-stock/', views.LowStockAnalyticsView.as_view(), name='low-stock-analytics'),
    path('analytics/low-stock', views.LowStockAnalyticsView.as_view()),
    path('analytics/stock-turnover/', views.StockTurnoverAnalyticsView.as_view(), name='stock-turnover-analytics'),
    path('analytics/stock-turnover', views.StockTurnoverAnalyticsView.as_view()),
    path('analytics/category-summary/', views.CategorySummaryView.as_view(), name='category-summary'),
    path('analytics/category-summary', views.CategorySummaryView.as_view()),
    path('analytics/movement-summary/', views.MovementSummaryView.as_view(), name='movement-summary'),
    path('analytics/movement-summary', views.MovementSummaryView.as_view()),
    path('analytics/dashboard-overview/', views.DashboardOverviewView.as_view(), name='dashboard-overview'),
    path('analytics/dashboard-overview', views.DashboardOverviewView.as_view()),
    path('analytics/stock-flow/', views.StockFlowTrendsView.as_view(), name='stock-flow-trends'),
    path('analytics/stock-flow', views.StockFlowTrendsView.as_view()),
    path('analytics/low-stock/<int:category_id>/', views.LowStockByCategoryView.as_view(), name='low-stock-category'),
    path('analytics/low-stock/<int:category_id>', views.LowStockByCategoryView.as_view()),
    path('analytics/low-stock/<int:category_id>/<int:supplier_id>/', views.LowStockByCategoryAndSupplierView.as_view(), name='low-stock-category-supplier'),
    path('analytics/low-stock/<int:category_id>/<int:supplier_id>', views.LowStockByCategoryAndSupplierView.as_view()),
]