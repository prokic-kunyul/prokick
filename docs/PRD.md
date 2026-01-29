# Product Requirements Document (PRD) - Prestige Sport

## 1. Introduction

**Project Name:** Prestige Sport
**Description:** A premium, high-fidelity e-commerce platform dedicated to authentic football jerseys.
**Target Audience:** Football enthusiasts, collectors, and players looking for high-quality kits.
**Vision:** To build the "Pro-Direct / Subside Sports" of Indonesia, focusing on a dark, cinematic, and premium user experience (UX).

## 2. Technical Stack

The project utilizes the latest "Bleeding Edge" web technologies for maximum performance and developer experience.

| Category       | Technology        | Version / Features                          |
| :------------- | :---------------- | :------------------------------------------ |
| **Framework**  | **Next.js**       | v16 (App Router, Server Actions)            |
| **Language**   | **TypeScript**    | Strict Mode enabled                         |
| **Styling**    | **Tailwind CSS**  | v4 (Beta) - Native CSS variable support     |
| **Animations** | **Framer Motion** | Complex UI transitions & micro-interactions |
| **Database**   | **SQLite** (Dev)  | Prisma ORM (Migration & Schema Management)  |
| **State**      | **Zustand**       | Client-side Cart & Global Store             |
| **UI Lib**     | **Shadcn/UI**     | Radix Primitives + Lucide Icons             |

## 3. Core Features

### 3.1. Storefront (Client Side)

- **Hero Section:**
  - Split Grid Layout (Text Left, Carousel Right) inspired by FIFA Store.
  - Auto-rotating banners with "Neon Glow" effects.
  - Call-to-Action (CTA) buttons for Catalog and Collection.
- **Product Catalog:**
  - Dynamic filtering (League, Team, Type).
  - Search functionality.
  - Grid view with "Quick Add" options.
- **Product Details:**
  - High-res image gallery.
  - **Dynamic Stock System:** Real-time stock check per size.
  - **Customization Engine:** Option to add Nameset (Official/Fan) and Patches.
- **Cart & Checkout:**
  - Step-by-step checkout (Stepper UI).
  - Promo Code logic (e.g., Buy 3 Get 1 Free).
  - **WhatsApp Integration:** Orders finalized via WhatsApp for personalized handling.

### 3.2. Admin Panel (Server Side)

- **Dashboard:** Sales overview and key metrics.
- **Product Management:**
  - CRUD (Create, Read, Update, Delete) for Jerseys.
  - JSON-based Stock Management (`{"S": 10, "M": 5}`).
  - "Special Edition" and Category support.
- **Order Management:**
  - Status tracking (Pending, Paid, Shipped).
  - Delete/Archive orders.
- **Banner Management:**
  - Upload & manage Homepage Banners dynamically.
  - Toggle Active/Inactive status.

## 4. Database Schema (Snapshot)

Using Prisma ORM with SQLite (migratable to PostgreSQL).

```prisma
model Jersey {
  id          String   @id @default(cuid())
  team        String
  category    String   // Jersey, Retro, etc.
  price       Decimal  // Handled as Number in frontend
  stockData   String   // JSON: {"S":10, "M":5}
  images      JerseyImage[]
}

model Banner {
  id        String   @id @default(cuid())
  image     String
  active    Boolean  @default(true)
}
```

## 5. Deployment & Environment

- **Environment Variables:**
  - `DATABASE_URL`: Connection string.
  - `NEXT_PUBLIC_BASE_URL`: For SEO/Sitemap generation.
- **Build Command:** `npm run build`
- **Start Command:** `npm run start`

## 6. Future Roadmap

1.  **Payment Gateway:** Integration with Midtrans/Xendit (currently WhatsApp manual).
2.  **Cloud Storage:** Move from local `public/uploads` to UploadThing/AWS S3.
3.  **User Accounts:** Full OAuth (Google Login) transformation (currently Guest-first).
4.  **Blog/News:** Section for football news to boost SEO.

---

_Document Version: 1.0.0_
_Last Updated: Dec 2025_
