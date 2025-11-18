# ItaPay Admin Panel

Professional admin panel for managing ItaPay customers, accounts, and operations.

## Features

- ✅ Dashboard with real-time statistics
- ✅ Customer management (list, view, approve/reject)
- ✅ Account management (view balances, status)
- ⏳ Transfers (coming soon when backend is ready)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios for API calls

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=https://itapay-backend.vercel.app
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy!

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── layout.tsx            # Root layout with sidebar
│   ├── globals.css           # Global styles
│   ├── customers/
│   │   ├── page.tsx          # Customer list
│   │   └── [id]/page.tsx     # Customer details & approve/reject
│   ├── accounts/
│   │   └── page.tsx          # Account list
│   └── transfers/
│       └── page.tsx          # Transfers (placeholder)
├── components/
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── Button.tsx            # Button component
│   └── Card.tsx              # Card component
└── lib/
    ├── api.ts                # API client (axios)
    └── utils.ts              # Utility functions
```

## Usage

### Approve/Reject Customers

1. Go to "Customers"
2. Click on a customer
3. Review information
4. Click "Approve" or "Reject"

### View Accounts

1. Go to "Accounts"
2. See all accounts with balances
3. Search by account number

## Notes

- No authentication required for MVP
- Transfers page is placeholder until backend is ready
- All data comes from backend API
