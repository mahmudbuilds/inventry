from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("inventory", "0002_company_tenancy")]

    operations = [
        migrations.AlterField(
            model_name="product",
            name="sku",
            field=models.CharField(max_length=50),
        ),
        migrations.AddConstraint(
            model_name="product",
            constraint=models.UniqueConstraint(
                fields=("company", "sku"), name="unique_company_sku"
            ),
        ),
    ]
