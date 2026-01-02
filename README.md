# Personal Thinking Space

A minimal, file-based personal blog built with Next.js (App Router).

## 🌟 Philosophy
- **Public by default**: A space for thinking and learning.
- **Minimal & Calm**: Blue aesthetic, ample whitespace, handwriting fonts for warmth.
- **No Database**: Content lives in Markdown files.

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run local server**:
   ```bash
   npm run dev
   ```

3. **Open**: [http://localhost:3000](http://localhost:3000)

## 📁 Content Management

This site is a static, file-based CMS. No admin panel, just files.

### Adding a Post
Create a new Markdown file in `content/posts/`.
The filename becomes the URL slug (e.g., `my-post.md` -> `/posts/my-post`).

**Required Frontmatter:**
```markdown
---
title: My Post Title
date: "Dec 30, 2025 — 9:00 PM"
category: Learning
---
```
*Categories: Learning, Life, Moments*

### Adding a Project
Create a new Markdown file in `content/projects/`.

**Required Frontmatter:**
```markdown
---
name: Project Name
description: Short one-line description.
stack: React, Node.js
status: learning
learned: One sentence on what you learned.
links:
  github: https://github.com...
  demo: https://example.com
---
```
*Status: learning, finished, paused*

## 🔍 Search Implementation
Search is **Client-Side** and **Database-Free**.
1. **Index**: A server API route (`/api/search`) reads all Markdown files at runtime and returns a JSON array of titles, descriptions, and content.
2. **Client**: The `Search` component fetches this JSON lazily (only when you interact with search).
3. **Engine**: We use `Fuse.js` for fuzzy, typo-tolerant searching on the client.

## 🎨 Styling
Styles are defined in `src/app/globals.css`.
- **CSS Variables**: define the color palette (`--color-primary`, `--color-bg`, etc).
- **Fonts**:
  - `Patrick Hand` (Google Font) for body text (Handwriting feel).
  - `Inter` (Google Font) for UI elements (Headings, metadata).

To change the "Blue" theme, purely edit the `:root` variables in `globals.css`.
