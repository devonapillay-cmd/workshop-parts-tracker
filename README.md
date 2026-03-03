# Workshop Parts Tracker

A mobile-first single-workshop parts tracking app built with **Next.js + TypeScript + Prisma + SQLite + Tailwind CSS**.

Track part requests as:
- **Needed**
- **Ordered**
- **Received**

## Features

- Create a part request
- List and filter by status tabs (Needed / Ordered / Received / All)
- One-tap status advance (Needed → Ordered → Received)
- Manual status change from dropdown
- Edit and delete requests
- Search by part name, job ref, or customer name
- PWA basics:
  - Web app manifest
  - Service worker for offline open/view of cached pages

## 1) Setup

```bash
npm install
cp .env.example .env
```

## 2) Prisma / database

Create and apply migrations (SQLite):

```bash
npx prisma migrate dev
```

Generate Prisma client (if not already generated):

```bash
npx prisma generate
```

## 3) Run locally

```bash
npm run dev
```

App URLs:
- Main page: `http://localhost:3000/parts`
- New part: `http://localhost:3000/parts/new`

## 4) Open from your phone (same Wi‑Fi)

1. Find your computer's LAN IP:
   - macOS/Linux: `ip a` or `ifconfig`
   - Windows: `ipconfig`
2. Start app with `npm run dev` (already binds to `0.0.0.0` in this project).
3. On your phone browser, open:
   - `http://<YOUR_COMPUTER_IP>:3000/parts`

Example:
- `http://192.168.1.25:3000/parts`

If it doesn't load:
- Ensure both devices are on the same Wi‑Fi
- Allow port `3000` through local firewall
- Keep the terminal running

## 5) PWA install

On mobile browser:
- Open `/parts`
- Use **Add to Home Screen** / **Install app** from browser menu

Notes:
- Offline behavior is intentionally simple: cached views can open offline.
- Data writes (create/update/delete) require network access.

## Project structure

- `app/parts` – pages for list/new/edit
- `app/api/parts` – CRUD + status-advance APIs
- `prisma/schema.prisma` – data model
- `public/manifest.webmanifest` + `public/sw.js` – PWA basics
