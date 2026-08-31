from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class Company(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class CompanyMembership(models.Model):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="memberships"
    )
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="company_membership"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    password_change_required = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["company", "user"], name="unique_company_user"
            )
        ]


def company_for_user(user):
    if not user or not user.is_authenticated:
        return None
    membership = getattr(user, "company_membership", None)
    return membership.company if membership else None


class Category(models.Model):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="categories", null=True
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Supplier(models.Model):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="suppliers", null=True
    )
    name = models.CharField(max_length=100)
    contact_email = models.EmailField()
    phone = models.CharField(max_length=20)

    def __str__(self):
        return self.name


class Product(models.Model):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="products", null=True
    )
    sku = models.CharField(max_length=50)
    name = models.CharField(max_length=200)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="products"
    )
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.CASCADE,
        related_name="products",
        null=True,
        blank=True,
    )
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_in_stock = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["company", "sku"], name="unique_company_sku"
            )
        ]

    def __str__(self):
        return self.name


class StockMovement(models.Model):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="movements", null=True
    )
    MOVEMENT_TYPES = (
        ("IN", "Stock In (Purchase/Restock)"),
        ("OUT", "Stock Out (Sale/Dispatch)"),
    )

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="movements"
    )
    movement_type = models.CharField(max_length=10, choices=MOVEMENT_TYPES)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    timestamp = models.DateTimeField(auto_now_add=True)
    performed_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.movement_type} - {self.product.name} - ({self.quantity})"
