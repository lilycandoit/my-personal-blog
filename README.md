# 🌱 Duong's blog

A minimal, database-backed personal blog built with **Next.js App Router**, featuring an authenticated admin panel for managing posts, projects, and media.

Designed as a scalable personal platform for writing, learning logs, and portfolio projects — without touching code for content updates.

---

## ✨ Highlights

* **Admin CMS** – Secure dashboard to create and manage posts & projects
* **Rich Text Editor** – TipTap with images, links, and formatting
* **Image Uploads** – Drag & drop uploads via Vercel Blob
* **Cover Images & Galleries** – Automatic or manual selection
* **Client-side Search** – Fast fuzzy search with Fuse.js
* **Responsive UI** – Clean layout with custom CSS variables

---

## 🧑‍💻 Tech Stack

* **Framework**: Next.js 16 (App Router)
* **Database**: PostgreSQL + Prisma ORM
* **Authentication**: NextAuth (Credentials)
* **Storage**: Cloudinary
* **Editor**: TipTap
* **Search**: Fuse.js
* **Styling**: Tailwind CSS, Inter & Patrick Hand fonts

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* PostgreSQL database (Neon recommended)
* Vercel account (for Blob storage)

### Setup

```bash
git clone <your-repo>
cd my-personal-blog
npm install
cp .env.example .env
```

Set environment variables:

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

Run migrations and seed admin user:

```bash
npx prisma migrate dev
ADMIN_PASSWORD="your-password" npx tsx prisma/seed.ts
```

Start the dev server:

```bash
npm run dev
```

Visit [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Email: admin@example.com
- Password: (the one set above)

---

## 🗂️ Routes Overview

* `/posts` – Blog posts
* `/projects` – Portfolio projects
* `/about`, `/contact`
* `/admin/*` – Protected admin panel

---

## 🖼️ Media Handling

* Multiple image uploads per post/project
* Automatic dimension extraction
* Cover image selection
* Optimized delivery via Vercel Blob

---

## 🔐 Security Notes

* Passwords hashed with bcrypt
* Environment-based secrets
* Separate dev & production databases recommended

---

## 🚢 Deployment

Deploys automatically on Vercel connected with DB hosted on Neon.

---

## 📄 License

MIT

