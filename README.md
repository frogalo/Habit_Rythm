# Habit Rhythm

A modern, full-stack habit tracker built with **Next.js 15**, **PostgreSQL**, **Prisma**, and **NextAuth**.

Track your habits with a visual calendar, customizable colors, and secure authentication.

## Features

- User authentication via Google and GitHub with an optional local test user.
- Habit creation, editing, and removal with per-habit color selection.
- Day-by-day completion tracking for weekly and monthly views.
- PostgreSQL persistence through Prisma ORM.
- Responsive UI with toast notifications and confirmation flows.

## Tech Stack

- [Next.js 15 (App Router)](https://nextjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [react-hot-toast](https://react-hot-toast.com/)
- [react-colorful](https://github.com/omgovich/react-colorful)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker run -d -p 5432:5432 --name habit-rhythm-postgres -e POSTGRES_DB=habit_rhythm -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres postgres:16-alpine
```

### 3. Configure environment variables

Create a `.env.local` file:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/habit_rhythm?schema=public
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MOCK_AUTH_ENABLED=true
TEST_USER_NAME=Test User
TEST_USER_EMAIL=test@habit-rhythm.local
TEST_USER_PASSWORD=change-me
TEST_USER_PERMISSIONS=habit:read,habit:write,habit:delete
NEXT_PUBLIC_ENABLE_TEST_LOGIN=true
NEXT_PUBLIC_TEST_USER_EMAIL=test@habit-rhythm.local
```

For VPS / Docker deployment, copy `.env.vps.example` to `.env` and fill in the real values.

### 4. Generate Prisma client and create the schema

```bash
npm run db:generate
npm run db:migrate -- --name init
```

For Docker on a VPS, start PostgreSQL first and apply the committed Prisma migrations:

```bash
docker compose up -d postgres
docker compose run --rm app npx prisma migrate deploy
docker compose up -d app
```

### 5. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Test User

When `MOCK_AUTH_ENABLED=true`, the login page exposes a credentials form for a seeded test user.

On first sign-in, the app creates the test user in PostgreSQL with mock habits and the permissions from `TEST_USER_PERMISSIONS`.

## Project Structure

```text
habit-rhythm/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   ├── features/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── habitData.ts
│   │   └── getUserBySession.ts
│   └── pages/
└── ...
```
