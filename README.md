# NexCoin - Next Crypto Dashboard (In progress)

A modern, responsive cryptocurrency dashboard built with **Next.js 15**, **TypeScript**, **TailwindCSS 4**, and **ShadCN UI components**. This project fetches data from the public **CoinGecko API** and displays it in both list and chart formats, offering users a fast and visually appealing way to monitor cryptocurrency trends.

---

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Motivation & Choices](#motivation--choices)
- [License](#license)

---

## Demo

> A live demo will be available soon.

---

## Features

- Display real-time cryptocurrency data from CoinGecko API.
- Interactive charts using **Recharts**.
- Responsive design with **TailwindCSS**.
- Mobile-friendly navigation using **ShadCN/Radix Popover**.
- Dark/light theme support.
- Modular and reusable components (`MobileMenu`, `About`, `Footer`).
- Global state for authentication using **RTK** (or optional **Zustand** for simpler state management).
- API fetching and caching using **TanStack React Query**.

---

## Technologies Used

- **Next.js 15** – App Router, server/client components, optimized routing.
- **React 19** – UI framework.
- **TypeScript 5** – Type safety and developer experience.
- **TailwindCSS 4** – Utility-first CSS framework.
- **ShadCN UI** – Headless UI components built on Radix for accessibility and animations.
- **clsx & class-variance-authority (CVA)** – Conditional styling and component variants.
- **React Query (TanStack)** – Data fetching and caching.
- **Zustand** – Global state for authentication.
- **Zod** – Validation schemas.
- **Lucide-react** – Lightweight, modern icons.
- **Recharts** – Interactive charting.

---

## Project Structure
```bash
src/
├─ assets/ # Images and illustrations
├─ components/
│ ├─ shared/ # Reusable components (MobileMenu, Footer, etc.)
│ └─ ui/ # ShadCN UI wrappers
├─ pages/ # Routes (Next.js)
└─ styles/ # Tailwind and global styles
```
---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/next-cryptodashboard.git
cd next-cryptodashboard
```
Install dependencies:

```bash
npm install
```
Run the development server:

```bash
npm run dev
```
The app will be available at http://localhost:3000.

## Usage and endpoints
### Endpoints

- **/** – Homepage with About section and crypto charts.

- **/crypto** – Crypto list with filters and details.

- **/users** - manages the logic of login and registering a new user

### Usage
- Buttons and navigation menus use Next.js router for programmatic navigation.

- Reusable components (like MobileMenu and Footer) adapt to dark/light themes automatically.

## Motivation & Choices
- Next.js 15: Chosen for modern App Router features, server/client components, and optimized routing.

- TailwindCSS + ShadCN: Utility-first styling combined with accessible, headless UI components allows fast development without compromising design or accessibility.

- React Query vs RTK Query(optional): React Query chosen for API fetching to simplify caching, refetching, and data management. RTK retained only for global authentication state.

- Zustand: Considered for simpler global state management in the future if needed.

- Recharts: Provides interactive, responsive charts for crypto data visualization.

- Folder structure: Organized to separate shared components, UI wrappers, assets, and pages for modularity and scalability.

The goal is to build a fast, responsive, and modern crypto dashboard with clean, maintainable code and reusable components.

## License
This project is licensed under the MIT License.




