from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase
from datetime import datetime, timedelta

from .models import Category, Company, CompanyMembership, Product, StockMovement


class StockMovementPaginationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="movement-tester",
            password="test-password",
        )
        company = Company.objects.create(name="Movement Test Company")
        CompanyMembership.objects.create(company=company, user=self.user)
        category = Category.objects.create(name="Test category", company=company)
        product = Product.objects.create(
            sku="TEST-001",
            name="Test product",
            category=category,
            unit_price=10,
            company=company,
        )
        StockMovement.objects.bulk_create(
            [
                StockMovement(
                    product=product,
                    company=company,
                    movement_type="IN",
                    quantity=index + 1,
                    performed_by=self.user,
                )
                for index in range(21)
            ]
        )
        self.client.force_authenticate(user=self.user)

    def test_history_is_paginated_in_batches_of_twenty(self):
        response = self.client.get(reverse("stock-movement-list"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 21)
        self.assertEqual(len(response.data["results"]), 20)
        self.assertIsNotNone(response.data["next"])
        self.assertIsNone(response.data["previous"])

        second_page = self.client.get(reverse("stock-movement-list"), {"page": 2})

        self.assertEqual(second_page.status_code, 200)
        self.assertEqual(len(second_page.data["results"]), 1)
        self.assertIsNone(second_page.data["next"])
        self.assertIsNotNone(second_page.data["previous"])

    def test_limit_keeps_dashboard_preview_unpaginated(self):
        response = self.client.get(reverse("stock-movement-list"), {"limit": 8})

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 8)


class InventoryPermissionTests(APITestCase):
    def setUp(self):
        self.member = User.objects.create_user(
            username="member",
            password="test-password",
        )
        member_company = Company.objects.create(name="Member Company")
        CompanyMembership.objects.create(company=member_company, user=self.member)
        self.staff = User.objects.create_user(
            username="staff",
            password="test-password",
            is_staff=True,
        )
        staff_company = Company.objects.create(name="Staff Company")
        CompanyMembership.objects.create(company=staff_company, user=self.staff)
        self.admin = User.objects.create_superuser(
            username="admin",
            password="test-password",
        )
        admin_company = Company.objects.create(name="Admin Company")
        CompanyMembership.objects.create(company=admin_company, user=self.admin)
        self.category_url = reverse("category-list")

    def test_member_can_read_but_cannot_create(self):
        self.client.force_authenticate(user=self.member)

        self.assertEqual(self.client.get(self.category_url).status_code, 200)
        response = self.client.post(self.category_url, {"name": "Member category"})

        self.assertEqual(response.status_code, 403)

    def test_staff_can_create_but_cannot_delete(self):
        self.client.force_authenticate(user=self.staff)
        create_response = self.client.post(
            self.category_url, {"name": "Staff category"}
        )
        category_id = create_response.data["id"]

        self.assertEqual(create_response.status_code, 201)
        delete_response = self.client.delete(
            reverse("category-detail", args=[category_id])
        )

        self.assertEqual(delete_response.status_code, 403)

    def test_admin_can_delete(self):
        category = Category.objects.create(
            name="Admin category",
            company=CompanyMembership.objects.get(user=self.admin).company,
        )
        self.client.force_authenticate(user=self.admin)

        response = self.client.delete(reverse("category-detail", args=[category.id]))

        self.assertEqual(response.status_code, 204)


class StockFlowAnalyticsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="flow-tester",
            password="test-password",
        )
        company = Company.objects.create(name="Flow Test Company")
        CompanyMembership.objects.create(company=company, user=self.user)
        category = Category.objects.create(name="Flow category", company=company)
        self.product = Product.objects.create(
            sku="FLOW-001",
            name="Flow product",
            category=category,
            unit_price=10,
            company=company,
        )
        self.client.force_authenticate(user=self.user)

    def test_stock_flow_aggregates_daily_in_and_out_values(self):
        today = timezone.now()
        StockMovement.objects.create(
            product=self.product,
            company=CompanyMembership.objects.get(user=self.user).company,
            movement_type="IN",
            quantity=7,
            performed_by=self.user,
        )
        StockMovement.objects.create(
            product=self.product,
            company=CompanyMembership.objects.get(user=self.user).company,
            movement_type="OUT",
            quantity=3,
            performed_by=self.user,
        )
        StockMovement.objects.filter(product=self.product).update(timestamp=today)

        response = self.client.get(reverse("stock-flow-trends"), {"days": 7})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            [
                {
                    "date": today.date().isoformat(),
                    "stock_in": 7,
                    "stock_out": 3,
                }
            ],
        )

    def test_stock_flow_excludes_movements_before_calendar_window(self):
        old_movement = StockMovement.objects.create(
            product=self.product,
            company=CompanyMembership.objects.get(user=self.user).company,
            movement_type="IN",
            quantity=9,
            performed_by=self.user,
        )
        old_movement.timestamp = timezone.now() - timedelta(days=8)
        old_movement.save(update_fields=["timestamp"])

        response = self.client.get(reverse("stock-flow-trends"), {"days": 7})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_stock_flow_includes_movement_exactly_days_before_today(self):
        boundary_movement = StockMovement.objects.create(
            product=self.product,
            company=CompanyMembership.objects.get(user=self.user).company,
            movement_type="IN",
            quantity=5,
            performed_by=self.user,
        )
        boundary_date = timezone.localdate() - timedelta(days=7)
        boundary_movement.timestamp = timezone.make_aware(
            datetime.combine(boundary_date, datetime.min.time())
        )
        boundary_movement.save(update_fields=["timestamp"])

        response = self.client.get(reverse("stock-flow-trends"), {"days": 7})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            [
                {
                    "date": boundary_date.isoformat(),
                    "stock_in": 5,
                    "stock_out": 0,
                }
            ],
        )


# Create your tests here.
