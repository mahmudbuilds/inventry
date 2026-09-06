<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Inventry Product & Design Rules

## Plain Language & Public-Facing Copy Guidelines (No Technical Jargon)

This application is built for business owners, store managers, warehouse staff, and the general public—**not** technical engineers.
All user-facing copy, button labels, descriptions, and error notifications must be plain, conversational, and jargon-free:

- **Strictly Avoid Developer & Database Jargon**:
  - Do NOT use: *atomic*, *row-level locking*, *concurrency*, *race conditions*, *mutations*, *multi-tenant scoping*, *database schema*, *ledger*, *payload*, or *API endpoints*.
- **Strictly Avoid System & Infrastructure Jargon**:
  - Do NOT use: *backend server*, *provisioning*, *telemetry*, *TLS 1.3*, *SameSite cookies*, or *superuser*.
- **Standard Plain-Language Replacements**:
  - *Superuser* → **Admin** or **Primary Administrator**
  - *Console* → **Dashboard**
  - *Ledger* → **Stock History** or **Activity Log**
  - *Atomic locking / Concurrency control* → **Overselling Prevention** or **Safe Stock Protection**
  - *Multi-tenant isolation* → **Private Company Workspace**
  - *Provisioning organization* → **Setting up your company** or **Creating account**
  - *Verify your backend server is running* → **Unable to connect. Please check your internet connection and try again.**
  - *TLS 1.3 Secure* → **100% Secure** or **Protected & Encrypted**
