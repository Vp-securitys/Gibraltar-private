# Gibraltar Private Bank & Trust Web Application

This is a demo banking application for Gibraltar Private Bank & Trust built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Demo Login Credentials

You can use the following credentials to test the application:

### Regular User 1
- Email: john.smith@example.com
- Password: Password123!
- Access Code: GIB1234

### Regular User 2
- Email: sarah.johnson@example.com
- Password: Password123!
- Access Code: GIB5678

### Admin User
- Email: admin@gibraltarbank.com
- Password: AdminPass123!
- Access Code: ADMIN999

## Features

- Secure authentication with email, password, and access code
- Dashboard with account summary and transaction history
- Transfer functionality for ACH transfers
- Mobile check deposit feature
- Secure messaging system
- Admin utility for managing user data

## Setup Instructions

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up your Supabase project and add the environment variables
4. Run the database setup script to create tables and add dummy data
5. Start the development server with `npm run dev`

## Database Setup

The application requires several tables in Supabase:

- profiles: User profile information
- accounts: Banking accounts
- transactions: Transaction history
- deposits: Check deposit records
- transfers: Money transfer records
- messages: User-support communication

You can run the setup script to create these tables and populate them with dummy data:

\`\`\`bash
node scripts/supabase-setup.ts
\`\`\`

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
\`\`\`

## Admin Utility

The admin utility is available at `/admin/gibraltar-update-utility`. This page allows administrators to:

- Update user profiles
- Adjust account balances
- Approve or reject pending transactions

In a production environment, this page would require additional authentication and authorization.

Diazvalentina@7890
Diazvalentina@7890

