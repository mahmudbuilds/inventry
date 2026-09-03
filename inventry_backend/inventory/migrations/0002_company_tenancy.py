from django.db import migrations, models
import django.db.models.deletion


def assign_legacy_data(apps, schema_editor):
    User = apps.get_model("auth", "User")
    Company = apps.get_model("inventory", "Company")
    Membership = apps.get_model("inventory", "CompanyMembership")
    Category = apps.get_model("inventory", "Category")
    Supplier = apps.get_model("inventory", "Supplier")
    Product = apps.get_model("inventory", "Product")
    Movement = apps.get_model("inventory", "StockMovement")

    users = list(User.objects.all())
    if not users:
        return
    companies = {}
    for user in users:
        company = Company.objects.create(name=f"{user.username}'s Company")
        companies[user.pk] = company
        Membership.objects.create(company=company, user=user)

    default_company = companies[users[0].pk]
    for movement in Movement.objects.filter(company_id=None).select_related(
        "performed_by"
    ):
        company = companies.get(
            getattr(movement.performed_by, "pk", None), default_company
        )
        Movement.objects.filter(pk=movement.pk).update(company=company)
    for product in Product.objects.filter(company_id=None):
        movement = product.movements.filter(company_id__isnull=False).first()
        Product.objects.filter(pk=product.pk).update(
            company=movement.company if movement else default_company
        )
    for category in Category.objects.filter(company_id=None):
        product = category.products.filter(company_id__isnull=False).first()
        Category.objects.filter(pk=category.pk).update(
            company=product.company if product else default_company
        )
    for supplier in Supplier.objects.filter(company_id=None):
        product = supplier.products.filter(company_id__isnull=False).first()
        Supplier.objects.filter(pk=supplier.pk).update(
            company=product.company if product else default_company
        )


class Migration(migrations.Migration):
    dependencies = [("inventory", "0003_alter_stockmovement_quantity")]

    operations = [
        migrations.CreateModel(
            name="Company",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=200, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="CompanyMembership",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "company",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="memberships",
                        to="inventory.company",
                    ),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="company_membership",
                        to="auth.user",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="category",
            name="company",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="categories",
                to="inventory.company",
            ),
        ),
        migrations.AddField(
            model_name="supplier",
            name="company",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="suppliers",
                to="inventory.company",
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="company",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="products",
                to="inventory.company",
            ),
        ),
        migrations.AddField(
            model_name="stockmovement",
            name="company",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="movements",
                to="inventory.company",
            ),
        ),
        migrations.AddConstraint(
            model_name="companymembership",
            constraint=models.UniqueConstraint(
                fields=("company", "user"), name="unique_company_user"
            ),
        ),
        migrations.RunPython(assign_legacy_data, migrations.RunPython.noop),
    ]
