# Stabilisha (GigWise) - Gig Worker Platform

A comprehensive platform for gig workers in Kenya, providing integrated financial services, credit scoring, SACCO integration, insurance, and AI-powered insights.

## Features

### 🎯 Core Features
- **Integrated Financial Wallet**: Multi-currency wallet (KES/USD) with blockchain-verified transactions
- **Gig Marketplace**: Browse and post gigs across multiple categories
- **Credit Scoring System**: Financial passport (300-850 score) based on gig consistency, payment history, and financial health
- **AI Income Insights**: Personalized predictions, recommendations, and market opportunities
- **SACCO Integration**: Rotating savings and credit cooperative with 2-3x loan eligibility
- **Insurance Coverage**: Income protection, equipment coverage with geotagged claim verification
- **AI Chatbot Assistant**: Financial advice and guidance powered by contextual AI

### 👥 User Types
- **Gig Workers**: Freelancers, virtual assistants, graphic designers, developers, photographers, etc.
- **Clients**: Businesses and individuals posting gigs

### 🎨 Design
- Custom theme with Plus Jakarta Sans, Lora, and IBM Plex Mono fonts
- Purple/orange color scheme with large border radius (1.4rem)
- Fully responsive design with dark mode support
- Built with shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT with HTTP-only cookies
- **Charts**: Recharts
- **Icons**: Lucide React

## Quick Start (Prototype)

### Prerequisites
- Neon PostgreSQL database connected (via v0 integration)

### Setup Steps

1. **Run the database migrations**:
   Execute the SQL scripts in order via the v0 interface:
   - `scripts/001-create-tables.sql`
   - `scripts/002-seed-data.sql`

2. **Start using the app**:
   The app works immediately with default settings. No environment variables needed for prototyping!

3. **Test accounts** (from seed data):
   - Worker: `john.doe@example.com` / `password123`
   - Client: `jane.smith@example.com` / `password123`

### Optional Configuration

For production deployment, you can set:
\`\`\`env
JWT_SECRET=your-super-secret-jwt-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
\`\`\`

But these have sensible defaults for development.

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Neon PostgreSQL database (automatically configured via integration)

### Installation

1. **Clone and install dependencies**:
\`\`\`bash
npm install
\`\`\`

2. **Set up environment variables**:
The Neon integration automatically provides `DATABASE_URL`. You only need to add:
\`\`\`env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

3. **Initialize the database**:
Run the SQL migration scripts in order:
\`\`\`bash
# These scripts are in the /scripts folder
# Run them via the v0 interface or your database client
001-create-tables.sql
002-seed-data.sql
\`\`\`

4. **Start the development server**:
\`\`\`bash
npm run dev
\`\`\`

5. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

### Core Tables
- `users` - User accounts (workers and clients)
- `wallets` - Financial wallets with multi-currency support
- `transactions` - Transaction history with blockchain verification
- `gigs` - Job postings and marketplace
- `worker_profiles` - Worker profiles with skills and ratings
- `credit_scores` - Financial passport scoring system
- `sacco_accounts` - SACCO savings and loan accounts
- `insurance_policies` - Insurance coverage policies
- `insurance_claims` - Claims with geotagged verification
- `ai_insights` - AI-generated insights and recommendations

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Wallet & Transactions
- `GET /api/wallet` - Get wallet balance and transactions

### Gigs
- `GET /api/gigs` - Browse gigs (filtered by user type)
- `POST /api/gigs` - Create new gig (clients only)

### Workers
- `GET /api/workers` - Browse worker profiles

### Credit Score
- `GET /api/credit-score` - Get credit score and loan eligibility

### AI Insights
- `GET /api/ai-insights` - Get personalized insights and predictions

### SACCO
- `GET /api/sacco` - Get SACCO account details
- `POST /api/sacco/contribute` - Make SACCO contribution

### Insurance
- `GET /api/insurance` - Get policies and claims
- `POST /api/insurance/claim` - File insurance claim

### Chatbot
- `POST /api/chatbot` - Chat with AI assistant

## Key Features Explained

### Credit Scoring
The credit score (300-850) is calculated based on:
- **Gig Consistency** (33%): Number of completed gigs
- **Payment History** (33%): Total earnings and payment patterns
- **Financial Health** (33%): Current wallet balance

Scores unlock loan eligibility from various lenders (M-Shwari, Tala, Branch).

### SACCO Integration
Workers can contribute to a rotating savings group and access loans up to 2-3x their savings. The system tracks rotation positions and payout schedules.

### Insurance Claims
Claims require geotagged images to prevent fraud. The system verifies location data and timestamps before processing claims.

### AI Insights
The AI system analyzes user patterns to provide:
- Income predictions
- Earning opportunities
- Market trends
- Financial recommendations
- Budget optimization tips

## Security Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- Blockchain verification for transactions
- Geotagged verification for insurance claims
- SQL injection protection via parameterized queries

## Contributing

This is a v0-generated project. To make changes:
1. Use the v0 chat interface to request modifications
2. Test thoroughly in the preview environment
3. Deploy to Vercel when ready

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact support through the v0 interface.
