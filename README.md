# NexCoin — Next Crypto Dashboard 🚀

A modern, responsive cryptocurrency dashboard built with **Next.js 15**, **TypeScript**, **TailwindCSS 4**, and **ShadCN UI**. The app fetches real-time data from the CoinGecko API and presents it in interactive charts and tables, offering a clean and fast way to track crypto market trends.

---

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage & Endpoints](#usage--endpoints)
- [Motivation & Choices](#motivation--choices)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Demo
A live demo will be available soon.

---

## Features
- Real-time cryptocurrency data via the CoinGecko API
- Interactive charts using Recharts
- Responsive design with TailwindCSS 4
- Mobile-friendly navigation with ShadCN/Radix components
- Dark / light theme toggle
- Reusable modular components (Navbar, Sidebar, Footer, charts, tables)
- Global state management via Zustand
- Data fetching & caching with TanStack React Query
- Error boundaries and skeleton loaders for improved UX

---

## Technologies Used
- Next.js 15 (App Router, Server/Client Components)
- React 19
- TypeScript 5
- TailwindCSS 4
- ShadCN UI / Radix
- TanStack React Query
- Zustand
- Zod (validation)
- Lucide-react (icons)
- Recharts (charts)

---

## Project Structure
```
src/
├── app/
│   ├── crypto/
│   │   ├── error.tsx
│   │   └── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   └── global-error.tsx
├── assets/                # images and illustrations
├── components/
│   ├── layout/            # pages layout components (Navbar, Footer, Charts)
│   ├── shared/            # shared UI and utilities (ReactQueryProvider, Sidebar)
│   └── ui/                # design-system primitives (button, card, table...)
├── custom hooks/          # useFetchCrypto.ts
├── lib/                   # utility and helper functions
├── schemas/               # zod schemas
├── store/                 # zustand stores for auth and favorites
└── types/                 # global TypeScript types and interfaces
```

---

## Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/next-cryptodashboard.git
cd next-cryptodashboard
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Usage & Endpoints

Routes
- `/` — Homepage with About section and featured charts
- `/crypto` — Full cryptocurrency list (sortable / filterable)
- `/users` — WIP: login/register and favorites

Notes
- Data fetching is handled by React Query (TanStack).
- Authentication and favorites are managed via Zustand (client-side; backend integration planned).
- Charts are implemented with Recharts and are responsive.

---

## Motivation & Choices
- Next.js 15: App Router and server components for performance and DX.
- Tailwind + ShadCN: fast styling and accessible UI primitives.
- React Query: robust fetching, caching and background updates.
- Zustand: lightweight global state management.
- Recharts: simple, interactive charting for analytics.

---

## Future Improvements
- Internationalization (i18next: EN, IT, etc.)
- Backend integration (Next serverless functions or Express + MongoDB)
- Authentication and persistent favorites
- Comprehensive tests (Jest + React Testing Library)
- CI/CD and demo deployment

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.