# Product Categories Architecture 🏷️

This document explains how **Prestige Sport** handles different product types (Jerseys, Shoes, Windbreakers, Others) across the application.

## 1. Category Definitions

We categorize products into 4 main types. This is stored in the `category` field of the `Jersey` (Product) model in the database.

| Category Name        | Identification in DB      | URL Route      | Features                                                |
| :------------------- | :------------------------ | :------------- | :------------------------------------------------------ |
| **Jersey**           | `Jersey`, `Retro`         | `/jersey`      | Has Season (2024/25), Type (Home/Away), Nameset Options |
| **Sepatu** (Shoes)   | `Sepatu`, `Sepatu Futsal` | `/sepatu`      | Numeric Sizes (39-45), Brand instead of League          |
| **Windbreaker**      | `Windbreaker`             | `/windbreaker` | Standard S-XXL sizes, simpler metadata                  |
| **Lainnya** (Others) | `Produk Lainnya`          | `/lainnya`     | General merchandise, accessories                        |

## 2. Technical Implementation

### A. Database Schema (`prisma/schema.prisma`)

All products share the same `Jersey` table, but use the `category` field to distinguish types.

```prisma
model Jersey {
  id        String @id
  category  String @default("Jersey") // "Sepatu", "Windbreaker", etc.
  // ...
}
```

### B. Admin Input (`app/admin/jerseys/new`)

The Admin Panel handles these categories dynamically:

- **Jersey:** Shows "Season", "Type" (Home/Away), and standard Size input.
- **Sepatu:**
  - Hides "Season" and "Type".
  - Changes "League" input to "Brand" dropdown (Nike, Adidas, etc.).
  - Usage specific Stock Manager logic.
- **Other:** Hides football-specific metadata.

### C. Size Guide Logic (`SizeGuide.tsx`)

The `SizeGuide` component automatically detects the category:

- **If Category == Sepatu:**
  - Displays `shoeSizes` (38, 39, 40...)
  - Columns: Size, Length (cm)
- **If Category != Sepatu:**
  - Displays `jerseySizes` (S, M, L...)
  - Columns: Size, Length (cm), Width (cm)

## 3. adding New Categories

If you need to add a new category (e.g., "Gloves"):

1.  **Update `lib/config.ts`** (if applicable) to include the new type.
2.  **Update Admin Page:** Add a new Tab in `NewJerseyPage` and `EditJerseyPage`.
3.  **Update Routes:** Create `app/gloves/page.tsx` with the appropriate Prisma `where` filter.
4.  **Size Guide:** Update `SizeGuide.tsx` to handle the new sizing standard.
