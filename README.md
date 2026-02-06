# Fitcheck Store

A premium, minimalist e-commerce storefront built with **Next.js 16**, **Prisma**, and **Tailwind CSS**.

## ✨ Features

- **Rebranded Experience**: Fully transitioned from Softly to **Fitcheck**.
- **Real-time Search**: Search autocomplete and suggestions in the navbar.
- **Image Optimization**: Global use of `next/image` with optimized `sizes` and `priority` loading.
- **Performance Focused**: Minimal layout shifts and poor LCP mitigation.
- **Modern UI**: Smooth animations with Framer Motion and Lucide icons.
- **Admin Dashboard**: Full product management (CRUD) for authorized administrators.
- **Compliance**: Sleek Cookie Consent banner and dedicated privacy/terms pages.
- **Responsive Design**: Mobile-first approach for shopping on any device.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file and add your database connection string:
   ```env
   DATABASE_URL="your-postgresql-url"
   ```

3. **Database Setup**:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed # Runs prisma/seed.js
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🛠 Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner

---
Built with 💙 by **Fitcheck Team**
