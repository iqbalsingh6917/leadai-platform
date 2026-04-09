# 🌐 Web App — LeadAI Platform Frontend

The main customer-facing web application built with Next.js 14+ and Tailwind CSS.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 14+](https://nextjs.org/) | React framework with App Router |
| [React 18](https://react.dev/) | UI component library |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [Zustand](https://zustand-demo.pmnd.rs/) | Lightweight global state management |
| [React Query (TanStack)](https://tanstack.com/query) | Server state, caching, mutations |
| [React Hook Form](https://react-hook-form.com/) | Form handling and validation |
| [Zod](https://zod.dev/) | Schema validation |
| [Recharts](https://recharts.org/) | Charts and data visualization |
| [Radix UI](https://www.radix-ui.com/) | Accessible headless UI components |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page / Login |
| `/dashboard` | Main dashboard with KPIs and activity feed |
| `/leads` | Unified Lead Inbox — all leads from all sources |
| `/pipeline` | Visual Kanban pipeline with drag-and-drop |
| `/contacts` | Contact management |
| `/campaigns` | Campaign creation, management, and analytics |
| `/workflows` | Visual workflow builder (no-code automation) |
| `/analytics` | Performance analytics and reporting |
| `/settings` | Tenant settings, integrations, billing, users |
| `/partner` | Partner portal for resellers |
| `/managed` | Read-only managed service dashboard for clients |
| `/onboarding` | 15-minute guided setup wizard |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run tests
npm run test
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
NEXT_PUBLIC_APP_NAME=LeadAI Platform
```

## Project Structure

```
apps/web/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Auth routes (login, register)
│   ├── (dashboard)/        # Protected dashboard routes
│   └── layout.tsx          # Root layout
├── components/             # Page-specific components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, API client
├── store/                  # Zustand stores
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```
