# Inventry Frontend 💻

The frontend client for **Inventry**, built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**.

> 💡 For full project architecture, backend setup, database models, and API reference, see the root [README.md](../README.md).

---

## 🛠️ Frontend Tech Stack

- **Framework:** [Next.js 16.3.2](https://nextjs.org/) (App Router, Turbopack, React Compiler enabled)
- **Library:** [React 19.2.8](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & PostCSS
- **UI & Components:** [shadcn/ui](https://ui.shadcn.com/), [@base-ui/react](https://base-ui.com/), [Lucide Icons](https://lucide.dev/)
- **Data Table:** [@tanstack/react-table v9](https://tanstack.com/table) + [@dnd-kit](https://dndkit.com/)
- **Charts:** [Recharts 3.8](https://recharts.org/)
- **Validation:** [Zod v4](https://zod.dev/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Package Manager & Linter:** [Bun](https://bun.sh/) & [Biome](https://biomejs.dev/)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
bun install
# or: npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 3. Run Development Server
```bash
bun dev
# or: npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

- `bun dev` - Starts the Next.js development server.
- `bun run build` - Builds the application for production.
- `bun run start` - Runs the production server.
- `bun run lint` - Runs Biome code checks.
- `bun run format` - Formats the codebase using Biome.
