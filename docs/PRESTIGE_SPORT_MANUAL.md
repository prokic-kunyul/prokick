# PRESTIGE.SPORT (Jersey Store Project) - Developer Handover Manual

## 1. Project Overview

A premium, dark-themed e-commerce platform for selling football jerseys.
**Goal:** High aesthetic value, smooth animations, and a seamless shopping experience.

## 2. Tech Stack (Core)

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (Beta), Framer Motion (Animations), clsx/tailwind-merge
- **State Management:** Zustand (Cart & Global State)
- **Database:** SQLite (dev) / PostgreSQL (prod ready) via Prisma ORM
- **UI Components:** Shadcn UI (Radix Primitives), Lucide-React Icons

## 3. Key Feature Implementations

### Shopping Cart System

- **Location:** `features/cart`
- **Logic:** `store.ts` (Zustand with persistence).
- **Checkout Flow:** Stepper UI -> Customer Form -> Options (Patch/Nameset) -> Payment (WhatsApp/Transfer).
- **Promo Logic:** `lib/promo.ts` (Buy 3 get 1 free, Free Shipping above 500k).

### Product Management

- **Location:** `app/admin/jerseys`, `features/products`
- **Validation:** Prisma Schema.
- **Handling:** `services/jerseys.ts` handles serialization (fixing Decimal issues).
- **Special Logic:**
  - **Stock Manager:** JSON-based stock management per size (`stockData` field).
  - **Dynamic Types:** Home, Away, Third, GK, Special Edition.
  - **Decimal Issue:** All decimals are converted to `Number()` before passing to Client Components to avoid serialization errors.

### Admin Panel

- **Location:** `app/admin`
- **Features:** Order Management (Status updates), Product CRUD, Banner Uploads.
- **Layout:** Hybrid SSR/CSR (Sidebar is client, Pages are text).

### Design System

- **Theme:** Dark Mode Only (Black/Navy/White).
- **Font:** Geist Sans.
- **Components:** Glassmorphism effects, heavy use of `bg-white/5` and `border-white/10`.

## 4. Database Schema (Prisma)

Key Models: `Jersey`, `Order`, `Banner`, `Testimonial`.
**Note:** `stockData` in `Jersey` is a JSON string storing size quantities (e.g. `{"S": 10, "M": 5}`).

## 5. Important Scripts

- `npm run dev`: Start development server.
- `npx prisma db push`: Sync schema changes to database (SQLite).
- `npx prisma studio`: Open database GUI.
- `npm run lint`: Check for code errors.

## 6. Common Pitfalls / Notes for Next AI

1.  **Decimal Serialization:** Always convert `Decimal` fields from Prisma to `Number` or `String` before passing to Client Components.
2.  **Image Uploads:** Currently using Blob/File handling to `public/uploads`.
3.  **Linting:** Project uses strict TypeScript. Don't use `any` if possible. Use `@ts-expect-error` if you absolutely must bypass a type check due to Prisma dynamic fields.
4.  **Admin Path:** Hardcoded to `/admin`. No complex RBAC yet (basic role check).

---

**Last Updated:** Dec 2025
**Status:** Stable, Production Ready Features.
