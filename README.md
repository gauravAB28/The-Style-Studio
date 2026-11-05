# The Style Studio Lounge

Luxury unisex salon website and booking system for **The Style Studio Lounge** (Derabassi, Punjab).

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, GSAP, Lenis Smooth Scroll, Three.js, React Router v7.
- **Backend**: Node.js, Express 5, `pg` (node-postgres connection pool), `zod` validation.
- **Database**: PostgreSQL on Supabase (`backend/db/schema.sql`).

---

## Getting Started

### 1. Database Setup
1. Create a PostgreSQL database on Supabase.
2. Run the DDL script in `backend/db/schema.sql` inside the Supabase SQL Editor.
3. Configure your connection string in `backend/.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Add your pooled connection string:
   ```env
   PORT=5000
   DATABASE_URL=postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
4. Seed services into the database idempotently:
   ```bash
   cd backend
   npm run db:seed
   ```

### 2. Run the Backend
```bash
cd backend
npm install
npm run dev
# Server listens on http://localhost:5000
```
Health check:
- `GET http://localhost:5000/api/health` returns `{"status":"ok","db":"connected"}` when connected to Postgres.

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000 (or 3001)
```

---

## Phase 1 Deliverables
- Connected backend to PostgreSQL (Supabase pooler) with health check `GET /api/health`.
- Removed customer login/OTP; booking drawer accepts Name (2-60 chars) and 10-digit Phone (`^[6-9]\d{9}$`).
- Idempotent seed script (`npm run db:seed`) seeding 16 services (including 5 Spa & Wellness rituals with null prices and longer duration bounds).
- Spa rates displayed as "Price confirmed at the studio" with 30% Wellness Privilege.
