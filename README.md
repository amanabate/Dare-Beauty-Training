# Dare Beauty Training Institute

**ደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም**

Premium vocational beauty academy management platform for Dare Women's & Men's Beauty Training Institute — Burayu, Sheger City, Oromia, Ethiopia.

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15 (App Router) | React framework & server-side rendering |
| React | 19 | UI component library |
| TypeScript | 5.8 | Static typing |
| Tailwind CSS | v4 | Utility-first styling |
| Motion (Framer Motion) | v12 | Animations & transitions |
| Lucide React | latest | Icon library |
| Recharts | latest | Data visualization & charts |
| React Hook Form | latest | Form state management |
| Zod | latest | Schema validation |
| Native fetch | — | API calls with `credentials: 'include'` |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20+ | Runtime |
| Express | 4 | HTTP server & routing |
| TypeScript | 5.8 | Static typing |
| Prisma ORM | 6 | Database access layer |
| PostgreSQL | 15+ | Primary relational database |
| JWT Authentication | — | Stateless auth tokens |
| HttpOnly cookie sessions | — | Secure session management |
| jose | latest | JWT signing & verification (HS256) |
| bcryptjs | latest | Password hashing |
| Zod | latest | Request validation |
| Multer | latest | File & image uploads |
| dotenv | latest | Environment variable loading |

---

## Project Structure

```
dare-beauty-training-institute/
├── frontend/                   # Next.js 15 App Router
│   ├── src/
│   │   ├── app/                # App Router pages & layouts
│   │   ├── components/         # Reusable UI components
│   │   ├── data/               # Static institute data
│   │   ├── types/              # TypeScript type definitions
│   │   └── utils/              # Utility functions
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                    # Express API server
│   ├── src/
│   │   ├── server.ts           # Entry point
│   │   ├── routes/             # API route handlers
│   │   ├── middleware/         # Auth, error, upload middleware
│   │   └── prisma/             # Prisma schema & migrations
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                # Workspace root
└── .env.example                # Environment variable template
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm 10+ or bun

### 1. Install dependencies

```bash
# From workspace root
npm run install:all

# Or individually
cd frontend && npm install
cd backend && npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in your DATABASE_URL, JWT_SECRET, APP_URL
```

### 3. Set up the database

```bash
cd backend
npm run db:generate   # generate Prisma client
npm run db:migrate    # run migrations
```

### 4. Run development servers

```bash
# Frontend (Next.js) — http://localhost:3000
npm run dev

# Backend (Express) — http://localhost:4000
npm run dev:backend
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for HS256 JWT signing |
| `APP_URL` | Public URL of the hosted app |
| `PORT` | Backend server port (default: 4000) |
