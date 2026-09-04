# Inventry 📦

> **Enterprise-Grade, Multi-Tenant Inventory & Supply Chain Intelligence Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![Django](https://img.shields.io/badge/Django-6.1-092e20?style=flat-square&logo=django)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-3.18-red?style=flat-square)](https://www.django-rest-framework.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#license)

**Live Demo:** [https://inventry-roan.vercel.app](https://inventry-roan.vercel.app)  
**Backend API:** [https://inventry-2sxu.onrender.com](https://inventry-2sxu.onrender.com)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup-django--drf)
  - [Frontend Setup](#2-frontend-setup-nextjs--bun)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
  - [Authentication & Identity](#authentication--identity)
  - [User Management](#user-management-admin-only)
  - [Inventory Operations](#inventory-operations)
  - [Analytics & Reports](#analytics--reports)
- [Database Schema & Multi-Tenancy](#-database-schema--multi-tenancy)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Inventry** is an inventory management and logistics tracking platform designed for modern businesses. Built as a decoupled full-stack application featuring a **Next.js 16 (React 19)** frontend and a **Django 6.1 (DRF)** REST backend, Inventry enables organizations to control catalogs, track real-time stock levels, prevent stockouts with predictive thresholds, execute atomic stock transfers, and visualize 30-day inventory movements.

Inventry enforces **strict multi-tenancy** at the database query level, ensuring complete cryptographic and logical tenant isolation. It incorporates **HTTP-Only JWT Cookie Authentication**, role-based permission gates, interactive drag-and-drop data tables, and interactive analytics charts.

---

## ✨ Key Features

### 🏢 Multi-Tenant Isolation
- **Organization Scoping:** Every entity (Categories, Suppliers, Products, Stock Movements, Users) is bound to a `Company`.
- **TenantMixin Security:** Django querysets automatically scope reads, writes, and deletions to the authenticated user's organization.
- **Unique Per-Tenant SKUs:** Products enforce SKU uniqueness within the company namespace (`UniqueConstraint(fields=["company", "sku"])`).

### 📦 Product & Catalog Management
- **Complete Lifecycle:** Create, edit, and organize products with custom SKU, category, supplier, unit price, stock count, and reorder levels.
- **Stock Health Badges:** Real-time stock status flags: `OK`, `LOW` (at or below reorder threshold), and `OUT` (zero stock).
- **Initial Inventory Automation:** When creating a product with starting inventory, an initial inbound stock movement (`IN`) is recorded atomically.

### 🔄 Atomic Stock Movements & Ledger
- **Inbound & Outbound Tracking:** Record restocks, purchases, sales, and dispatches.
- **Concurrency & Race Condition Protection:** Utilizes database row locking (`select_for_update`) and `@transaction.atomic` blocks to prevent stock discrepancies.
- **Negative Stock Prevention:** Outbound movements validate existing stock levels before deducting inventory.
- **Audit Ledger:** Every movement records the timestamp, user (`performed_by`), quantity, movement type, and optional audit notes.

### 📊 Business Intelligence & Analytics
- **Executive Overview:** Dashboard KPIs for Total Products, Total Units in Stock, Low Stock Alerts, and Inventory Turnover Rates with Month-over-Month percentage trends.
- **Interactive Stock Flow (Recharts):** 30-day visual timeline showing daily inbound vs. outbound units.
- **Stock Turnover Ratio:** Identifies high-velocity vs. slow-moving stock to optimize working capital.
- **Category & Movement Summaries:** Aggregate metrics on stock valuation, average unit cost, and net balance changes.

### 👥 Team & User Management
- **Role-Based Permissions:** Granular hierarchy across **Admin**, **Staff**, and **Member** roles.
- **Admin Management Console:** Create team accounts, modify user roles on the fly, toggle account active states, or revoke accounts.
- **First-Login Security:** Newly invited accounts require a mandatory password reset upon initial sign-in.

### ⚡ Power User Experience
- **Quick-Create Sheet:** Slide-out drawer accessible anywhere via keyboard or header to quickly create products, categories, suppliers, or movements.
- **Advanced Data Tables:** Powered by `@tanstack/react-table` with column sorting, live filtering, column visibility toggles, and `@dnd-kit` drag-and-drop row management.
- **Silent JWT Refreshing:** Client-side interceptor handles automatic token rotation in the background without session interruption.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([Web Browser])
    
    subgraph Frontend ["Frontend (Next.js 16 + React 19)"]
        AppRouter["Next.js App Router (Turbopack)"]
        Proxy["Edge Middleware (proxy.ts)"]
        UIComponents["shadcn/ui + Tailwind v4 + Recharts"]
        ApiClient["api-client.ts (Auto-Refresh Queue)"]
        AppRouter --> Proxy
        Proxy --> UIComponents
        UIComponents --> ApiClient
    end

    subgraph Backend ["Backend (Django 6.1 + DRF)"]
        Gunicorn["Gunicorn WSGI / WhiteNoise"]
        AuthModule["CookieJWTAuthentication"]
        TenantSecurity["TenantMixin & InventoryPermission"]
        Views["DRF Generics & APIViews"]
        Models["ORM Models (select_for_update)"]
        Gunicorn --> AuthModule
        AuthModule --> TenantSecurity
        TenantSecurity --> Views
        Views --> Models
    end

    subgraph Storage ["Data Layer"]
        Postgres[(PostgreSQL / SQLite3)]
        Models --> Postgres
    end

    ApiClient -- "HTTPS / SameSite HttpOnly Cookies" --> Gunicorn
```

---

## 💻 Technology Stack

### Frontend

| Layer / Tool | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) | `16.3.2` | App Router, Server Components, API rewrites |
| **Library** | [React](https://react.dev/) | `19.2.8` | UI rendering with React Compiler optimization |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `^5.0` | End-to-end static typing and interface contracts |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `^4.0` | Utility-first styling with modern PostCSS pipeline |
| **UI Primitives** | [shadcn/ui](https://ui.shadcn.com/) / [@base-ui/react](https://base-ui.com/) | `^4.19` / `^1.7` | Accessible, customizable component primitives |
| **Data Tables** | [@tanstack/react-table](https://tanstack.com/table) | `^9.1` | Headless table state, filtering, sorting, pagination |
| **Drag & Drop** | [@dnd-kit/core](https://dndkit.com/) | `^6.3` | Reorderable table rows and column organization |
| **Charts** | [Recharts](https://recharts.org/) | `3.8.0` | Responsive SVG area and line analytics charts |
| **Validation** | [Zod](https://zod.dev/) | `^4.4` | Client-side validation schemas |
| **Icons** | [Lucide React](https://lucide.dev/) | `^1.34` | Crisp, scalable icon library |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) | `^2.0` | Toast feedback notifications |
| **Tooling & Linter** | [Bun](https://bun.sh/) & [Biome](https://biomejs.dev/) | `1.3` / `2.4` | Fast package execution, linting, and formatting |

### Backend

| Layer / Tool | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [Django](https://www.djangoproject.com/) | `6.1` | High-level Python web framework |
| **API Toolkit** | [Django REST Framework](https://www.django-rest-framework.org/) | `3.18.0` | Serializers, generic views, pagination, filters |
| **Authentication** | [djangorestframework-simplejwt](https://django-rest-framework-simplejwt.readthedocs.io/) | `5.5.1` | JSON Web Token authentication with cookie rotation |
| **Database** | [PostgreSQL](https://www.postgresql.org/) / [SQLite](https://www.sqlite.org/) | `16+` / `3.x` | Relational database (SQLite local, PostgreSQL prod) |
| **DB Adapter** | [psycopg2-binary](https://www.psycopg.org/) & [dj-database-url](https://github.com/jazzband/dj-database-url) | `2.9` / `3.1` | PostgreSQL database connection string parsing |
| **Static Assets** | [WhiteNoise](http://whitenoise.evans.io/) | `6.12.0` | Efficient static asset compression and caching |
| **WSGI Server** | [Gunicorn](https://gunicorn.org/) | `26.2.0` | Production HTTP server for Python applications |
| **CORS** | [django-cors-headers](https://github.com/adamchainz/django-cors-headers) | `4.9.0` | Cross-Origin Resource Sharing handling |

---

## 🛡️ Role-Based Access Control (RBAC)

Inventry provides three explicit security tiers:

| Permission / Capability | Member | Staff | Admin |
| :--- | :---: | :---: | :---: |
| **View Dashboard & Inventory** | ✅ | ✅ | ✅ |
| **View Analytics & Reports** | ✅ | ✅ | ✅ |
| **Export Data & Movement History** | ✅ | ✅ | ✅ |
| **Create Products, Categories, Suppliers** | ❌ | ✅ | ✅ |
| **Record Stock Movements (In / Out)** | ❌ | ✅ | ✅ |
| **Edit Product Details & Reorder Levels** | ❌ | ✅ | ✅ |
| **Delete Products, Categories, Suppliers** | ❌ | ❌ | ✅ |
| **Manage Users (Invite, Promote, Deactivate)** | ❌ | ❌ | ✅ |
| **Delete User Accounts** | ❌ | ❌ | ✅ |

---

## 📁 Repository Structure

```
inventry/
├── inventry_backend/                 # Django REST Framework backend
│   ├── inventory/                    # Core inventory application
│   │   ├── migrations/               # Database schema migrations
│   │   ├── admin.py                  # Django admin registrations
│   │   ├── models.py                 # Company, Product, Movement, Supplier models
│   │   ├── permissions.py            # RBAC permission classes (InventoryPermission)
│   │   ├── serializers.py            # DRF ModelSerializers & Aggregation serializers
│   │   ├── tests.py                  # Unit and integration test suites
│   │   ├── urls.py                   # Inventory resource routing
│   │   └── views.py                  # API endpoints and analytical queries
│   ├── inventry_backend/             # Project configuration
│   │   ├── authentication.py         # CookieJWTAuthentication implementation
│   │   ├── settings.py               # Django settings (CORS, DB, JWT, Middlewares)
│   │   ├── urls.py                   # Root URL dispatcher
│   │   ├── views.py                  # Auth, JWT, user management & healthcheck views
│   │   └── wsgi.py                   # WSGI application entry point
│   ├── build.sh                      # Production deployment build script
│   ├── manage.py                     # Django CLI
│   └── requirements.txt              # Python dependencies
│
├── inventry_frontend/                # Next.js 16 frontend application
│   ├── public/                       # Static public assets
│   ├── src/
│   │   ├── app/                      # App Router pages and layouts
│   │   │   ├── (dashboard)/          # Authenticated dashboard layout
│   │   │   │   ├── analytics/        # Low stock, turnover, category & movement analytics
│   │   │   │   ├── categories/       # Category catalog view
│   │   │   │   ├── movements/        # Full movement audit ledger
│   │   │   │   ├── products/         # Product catalog management
│   │   │   │   ├── suppliers/        # Supplier directory
│   │   │   │   ├── users/            # Admin user management panel
│   │   │   │   └── page.tsx          # Main executive dashboard
│   │   │   ├── login/                # Authentication login page
│   │   │   ├── signup/               # Organization registration page
│   │   │   ├── globals.css           # Tailwind CSS v4 stylesheets
│   │   │   └── layout.tsx            # Root application layout
│   │   ├── components/               # React UI components
│   │   │   ├── ui/                   # shadcn / Base UI primitives
│   │   │   ├── app-sidebar.tsx       # Collapsible application navigation sidebar
│   │   │   ├── chart-area-interactive.tsx # 30-day stock flow area chart
│   │   │   ├── dashboard-recent-movements.tsx # Activity ledger preview
│   │   │   ├── data-table.tsx        # TanStack Table with drag-and-drop & filters
│   │   │   ├── quick-create-drawer.tsx # Universal creation sheet
│   │   │   └── section-cards.tsx     # KPI summary cards
│   │   ├── context/                  # React context providers (UserRole, QuickCreate)
│   │   ├── hooks/                    # Custom React hooks (useMobile, etc.)
│   │   ├── lib/                      # Utilities (api-client, fetchWithAuth, cn)
│   │   └── proxy.ts                  # Edge authentication routing middleware
│   ├── biome.json                    # Biome linting and formatting rules
│   ├── next.config.ts                # Next.js config with API proxy rewrites
│   ├── package.json                  # Frontend dependencies and npm scripts
│   └── tsconfig.json                 # TypeScript compiler configuration
│
└── README.md                         # Project documentation
```

---

## 🚀 Getting Started

Follow the steps below to set up and run the application locally on your machine.

### Prerequisites

- **Python 3.12+** (with `pip` and `venv`)
- **Node.js 20+** or **Bun 1.2+** (Bun is recommended)
- **Git**

---

### 1. Backend Setup (Django + DRF)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd inventry_backend
   ```

2. Create and activate a Python virtual environment:
   - **macOS / Linux:**
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```
   - **Windows (PowerShell):**
     ```powershell
     python -m venv .venv
     .venv\Scripts\Activate.ps1
     ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables (optional for local SQLite development):
   Create a `.env` file in `inventry_backend/`:
   ```env
   DEBUG=True
   SECRET_KEY=local-secret-development-key-123
   ALLOWED_HOSTS=localhost,127.0.0.1
   # Optional: Set DATABASE_URL to use PostgreSQL. If omitted, SQLite is used automatically.
   # DATABASE_URL=postgresql://user:password@localhost:5432/inventry_db
   ```

5. Run database migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the Django development server:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
   The backend API is now running at `http://127.0.0.1:8000/`.

---

### 2. Frontend Setup (Next.js + Bun)

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd inventry_frontend
   ```

2. Install dependencies using Bun (or npm):
   ```bash
   bun install
   # or: npm install
   ```

3. Configure the local environment variables:
   Create a `.env.local` file in `inventry_frontend/`:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```

4. Start the Next.js development server:
   ```bash
   bun dev
   # or: npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🔐 Environment Variables

### Backend (`inventry_backend/.env`)

| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `DEBUG` | No | `False` | Enables Django debug mode and lax cookie policies for local testing. |
| `SECRET_KEY` | Yes | `dev-fallback-key` | Cryptographic secret for signing sessions and JWTs. |
| `ALLOWED_HOSTS` | No | `*` | Comma-delimited list of permitted hosts/domains. |
| `DATABASE_URL` | No | SQLite fallback | PostgreSQL connection string (`postgresql://user:pass@host:port/db`). |
| `CSRF_TRUSTED_ORIGINS`| No | Local defaults | Comma-delimited list of trusted client origins for CSRF validation. |

### Frontend (`inventry_frontend/.env.local`)

| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `NEXT_PUBLIC_API_URL` | Yes | `http://127.0.0.1:8000` | Target Django backend URL forwarded by Next.js rewrites. |

---

## 📡 API Reference

All API routes are prefixed with `/api/`. Requests require HTTP-Only JWT cookies or an `Authorization: Bearer <token>` header unless marked Public.

### Authentication & Identity

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register/` | Public | Register a new organization, admin account, and obtain session cookies. |
| `POST` | `/api/auth/login/` | Public | Authenticate with username and password; sets HTTP-Only JWT cookies. |
| `POST` | `/api/auth/logout/` | Authenticated | Clears access and refresh tokens, invalidating the session. |
| `POST` | `/api/token/refresh/` | Public (Cookie) | Rotates refresh token and returns a fresh access token. |
| `GET` | `/api/auth/me/` | Authenticated | Retrieves current user profile, company details, role, and password state. |
| `POST` | `/api/auth/change-password/`| Authenticated | Updates the user's password and clears first-login flags. |
| `GET` | `/health_check/` or `/` | Public | System status and health monitor. |

### User Management (Admin Only)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/auth/users/` | Admin | List all user accounts in the authenticated user's company. |
| `POST` | `/api/auth/users/` | Admin | Provision a new team member with assigned role (`Admin`, `Staff`, `Member`). |
| `PATCH`| `/api/auth/users/<id>/` | Admin | Update user role or toggle active/disabled status. |
| `DELETE`| `/api/auth/users/<id>/` | Admin | Delete a team member account (cannot self-delete). |

### Inventory Operations

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/inventory/products/` | Authenticated | List company products (supports `?category=`, `?supplier=`, `?stock_status=`). |
| `POST` | `/api/inventory/products/` | Staff / Admin | Create a new product with optional starting inventory. |
| `GET` | `/api/inventory/products/<id>/` | Authenticated | Retrieve product details. |
| `PUT/PATCH` | `/api/inventory/products/<id>/` | Staff / Admin | Update product information, price, or reorder levels. |
| `DELETE`| `/api/inventory/products/<id>/` | Admin | Delete a product. |
| `GET` | `/api/inventory/categories/` | Authenticated | List categories with calculated item counts and average price. |
| `POST` | `/api/inventory/categories/` | Staff / Admin | Create a category. |
| `GET` | `/api/inventory/suppliers/` | Authenticated | List suppliers with associated product counts. |
| `POST` | `/api/inventory/suppliers/` | Staff / Admin | Create a supplier. |
| `POST` | `/api/inventory/movements/` | Staff / Admin | Record an atomic inbound (`IN`) or outbound (`OUT`) stock movement. |
| `GET` | `/api/inventory/movements/history/`| Authenticated | Paginated stock movement audit trail (supports `?limit=`, `?product=`, `?movement_type=`). |

### Analytics & Reports

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/inventory/analytics/dashboard-overview/` | Authenticated | High-level metrics: total stock, low stock count, turnover, month-over-month growth. |
| `GET` | `/api/inventory/analytics/stock-flow/` | Authenticated | 30-day timeline of daily inbound and outbound quantities (`?days=30`). |
| `GET` | `/api/inventory/analytics/low-stock/` | Authenticated | Filter products currently at or below their reorder threshold. |
| `GET` | `/api/inventory/analytics/stock-turnover/` | Authenticated | Turnover ratios per product (outbound volume / stock in stock). |
| `GET` | `/api/inventory/analytics/category-summary/` | Authenticated | Aggregate inventory count and valuation grouped by category. |
| `GET` | `/api/inventory/analytics/movement-summary/` | Authenticated | Lifetime totals of inbound vs outbound stock movements. |

---

## 🗄️ Database Schema & Multi-Tenancy

The multi-tenant data model links records to an organization (`Company`). The diagram below highlights key relationships:

```mermaid
erDiagram
    COMPANY ||--o{ COMPANY-MEMBERSHIP : has
    USER ||--o| COMPANY-MEMBERSHIP : belongs_to
    COMPANY ||--o{ CATEGORY : owns
    COMPANY ||--o{ SUPPLIER : owns
    COMPANY ||--o{ PRODUCT : owns
    COMPANY ||--o{ STOCK-MOVEMENT : records

    CATEGORY ||--o{ PRODUCT : categorizes
    SUPPLIER ||--o{ PRODUCT : supplies
    PRODUCT ||--o{ STOCK-MOVEMENT : tracks
    USER ||--o{ STOCK-MOVEMENT : performs

    COMPANY {
        int id PK
        string name
        datetime created_at
    }

    COMPANY-MEMBERSHIP {
        int id PK
        int company_id FK
        int user_id FK
        boolean password_change_required
        datetime created_at
    }

    PRODUCT {
        int id PK
        int company_id FK
        string sku
        string name
        decimal unit_price
        int quantity_in_stock
        int reorder_level
        datetime created_at
        datetime updated_at
    }

    STOCK-MOVEMENT {
        int id PK
        int company_id FK
        int product_id FK
        string movement_type "IN | OUT"
        int quantity
        datetime timestamp
        int performed_by_id FK
        text notes
    }
```

---

## 🚢 Deployment

Inventry is configured for deployment using modern cloud infrastructure:

### Frontend (Vercel)
- The Next.js frontend is deployed on **Vercel**.
- Next.js rewrites in `next.config.ts` route client-side requests from `/api/*` directly to the production backend endpoint on Render.
- Fast Edge Caching and dynamic Server Components ensure quick page loads.

### Backend (Render)
- The Django application is deployed on **Render** using a native Web Service.
- Production startup utilizes **Gunicorn** combined with **WhiteNoise** for compressed static asset serving.
- An automated build script (`build.sh`) handles dependency installation, static asset compilation, and safe database migrations:
  ```bash
  #!/usr/bin/env bash
  set -o errexit
  pip install -r requirements.txt
  python manage.py collectstatic --no-input
  python manage.py migrate --fake-initial
  ```

---

## 🧪 Testing

The backend includes test coverage for multi-tenant isolation, permissions, atomic movements, pagination, and analytics queries.

Run tests using the Django test runner:

```bash
cd inventry_backend
python manage.py test inventory
```

To run frontend linting and type checking:

```bash
cd inventry_frontend
bun run lint
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve Inventry:

1. **Fork** the repository.
2. **Create a branch**: `git checkout -b feature/your-feature-name`.
3. **Commit changes**: `git commit -m "feat: add your feature description"`.
4. **Push to branch**: `git push origin feature/your-feature-name`.
5. **Open a Pull Request**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/mahmudbuilds">Mahmud Tella</a>
</p>
