# Personal Blog

A minimal, database-backed personal blog built with Next.js 16 App Router, featuring an authenticated admin panel for content management with image uploads.

## ✨ Features

### Content Management
- **Rich Text Editor** - TipTap editor with formatting, links, images, and task lists
- **Image Upload** - Drag & drop multiple images with Vercel Blob storage
- **Cover Images** - Auto or manual cover image selection for posts and projects
- **Demo Videos** - Embed YouTube/Vimeo links for project demos
- **Categories** - Organize posts by Learning, Life, or Moments

### Admin Panel
- **Secure Authentication** - NextAuth with bcrypt password hashing
- **Password Visibility Toggle** - Eye icon to show/hide passwords on login
- **CRUD Operations** - Create, edit, and manage posts and projects
- **Image Management** - Upload up to 10 images per content (max 5MB each)
- **Admin Scripts** - Easy email and password management via CLI

### Public Features
- **Responsive Design** - Clean, blue aesthetic with ample whitespace
- **Client-Side Search** - Fuzzy search with Fuse.js (no database queries)
- **Image Galleries** - Display project/post images in responsive grids
- **Handwriting Fonts** - Patrick Hand for warmth, Inter for UI

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended for free tier)
- Vercel account (for Blob storage)

### Installation

1. **Clone and install**:
   ```bash
   git clone <your-repo>
   cd my-personal-blog
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your values:
   ```bash
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   NEXTAUTH_SECRET="run: openssl rand -base64 32"
   NEXTAUTH_URL="http://localhost:3000"
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
   ```

3. **Set up database**:
   ```bash
   npx prisma migrate dev
   ADMIN_PASSWORD="your-password" npx tsx prisma/seed.ts
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Login to admin panel**:
   - Visit [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
   - Email: `admin@example.com`
   - Password: (the one you set in step 3)

## 📦 Database Schema

- **User** - Admin authentication (email, hashed password)
- **Post** - Blog posts (slug, title, content, category, images)
- **Project** - Portfolio projects (name, description, stack, status, learnings, images, demo video)
- **Image** - Image metadata (URL, filename, size, dimensions, alt text)

## 🛠️ Key Commands

### Development
```bash
npm run dev                # Start dev server
npm run build              # Build for production
npm run lint               # Run ESLint
```

### Database
```bash
npx prisma studio          # Visual database editor
npx prisma migrate dev     # Create and run migrations
npx tsx prisma/seed.ts     # Seed database
```

### Admin Management
```bash
npm run change-email       # Update admin email
npm run change-password    # Update admin password
```

## 🎨 Architecture

### Route Structure
- `/` - Home page
- `/posts` - Blog posts listing
- `/posts/[slug]` - Individual post
- `/projects` - Projects listing
- `/projects/[slug]` - Individual project
- `/about` - About page
- `/contact` - Contact page
- `/admin/*` - Protected admin panel

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js with Credentials provider
- **Storage**: Vercel Blob for images
- **Editor**: TipTap rich text editor
- **Search**: Fuse.js client-side fuzzy search
- **UI**: Custom CSS with CSS variables
- **Icons**: Lucide React

## 🔒 Security

### Production Setup
1. **Change default credentials**:
   ```bash
   npm run change-email      # Use your personal email
   npm run change-password   # Set strong password
   ```

2. **Environment variables**: Set these in Vercel dashboard
   - `DATABASE_URL` - Production PostgreSQL connection
   - `NEXTAUTH_SECRET` - Random secret key
   - `NEXTAUTH_URL` - Your production URL
   - `BLOB_READ_WRITE_TOKEN` - Vercel Blob token

3. **Best practices**:
   - Use separate dev and production databases
   - Never commit `.env` files
   - Use strong passwords for production
   - Regularly update dependencies

## 📝 Content Creation Workflow

1. **Login** to `/admin`
2. **Create post/project** via admin panel
3. **Upload images** with drag & drop
4. **Select cover image** (optional, auto-selects first image)
5. **Write content** with rich text editor
6. **Publish** and view on public site

## 🎯 Image Upload Features

- **Drag & Drop** - Drop files or click to browse
- **Multiple Upload** - Up to 10 images per content
- **File Validation** - JPG, PNG, WebP, GIF up to 5MB
- **Auto Dimensions** - Extracts width/height with Sharp
- **Cover Selection** - Choose which image to display as cover
- **Gallery Display** - Responsive grid layouts on public pages

## 🚢 Deployment

Deploy to Vercel with automatic migrations:

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys and runs migrations via vercel-build script
```

The `vercel-build` script automatically:
1. Runs `prisma migrate deploy`
2. Generates Prisma Client
3. Builds Next.js app

## 📚 Documentation

- **CLAUDE.md** - Development guide for AI assistants
- **ADMIN-GUIDE.md** - Admin account management
- **.env.example** - Environment variables template

## 🤝 Contributing

This is a personal project, but feel free to fork and adapt for your own use!

## 📄 License

MIT
