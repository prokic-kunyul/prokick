# PRESTIGE SPORT ⚽

> **Premium E-Commerce Platform for Authentic Football Jerseys**

Prestige Sport is a high-fidelity e-commerce application built with the latest web technologies to provide a cinematic, premium shopping experience for football enthusiasts.

## 📚 Documentation

Detailed documentation for this project can be found in the `docs/` folder:

- **[📖 Project Manual](docs/PRESTIGE_SPORT_MANUAL.md)**  
  _Overview of the project structure, tech stack, and developer handover notes._

- **[🎨 Design System](docs/DESIGN_SYSTEM.md)**  
  _Guide to the "Blue Universe" theme, color palettes, typography, and UI effects._

- **[🚀 Deployment Guide](docs/DEPLOYMENT_GUIDE.md)**  
  _Step-by-step instructions for deploying to Vercel and setting up PostgreSQL._

- **[🛠 Optimization & Next Steps](docs/OPTIMIZATION_TASKS.md)**  
  _Guides for SEO, CDN integration (UploadThing), and performance optimizations._

- **[📄 Product Requirements (PRD)](docs/PRD.md)**  
  _Original feature specifications and roadmap._

---

## ⚡ Quick Start

### 1. Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/jersey-store.git

# Install dependencies
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env` (if available) or set the following variables:

```env
DATABASE_URL="file:./dev.db"  # Defaults to SQLite for local dev
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🏗 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** Tailwind CSS, Framer Motion
- **Database:** Prisma ORM (SQLite / PostgreSQL)
- **State Management:** Zustand
- **UI:** Shadcn/UI, Lucide Icons

---

_Built with ❤️ for the love of the game._
