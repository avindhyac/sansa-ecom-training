# Modern Ecommerce Store

A full-featured ecommerce store built with Next.js, featuring a bold black and jade theme, Google OAuth authentication, and secure Stripe payments.

## Features

- **Modern Design**: Bold black and jade color scheme with responsive Tailwind CSS
- **Product Catalog**: Browse multiple products with images, descriptions, and pricing
- **Authentication**: Google OAuth login/signup via Supabase Auth
- **Shopping Cart**: Add products to cart with quantity management
- **Secure Payments**: Stripe integration for payment processing
- **Database**: Supabase for products, customers, and order management
- **Order Tracking**: Track orders from creation to completion

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth)
- **Payments**: Stripe
- **Language**: TypeScript
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- A Stripe account

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the schema from `DATABASE_SCHEMA.md`
3. Configure Google OAuth:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URL to: `http://localhost:3000/auth/callback`
4. Get your API credentials from Project Settings > API

### 3. Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set up webhook endpoint:
   - URL: `http://localhost:3000/api/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### 4. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Test Stripe Webhooks Locally

Install Stripe CLI and run:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

## Project Structure

```
ecommerce-store/
├── app/
│   ├── api/
│   │   ├── create-payment-intent/  # Stripe payment intent creation
│   │   └── webhook/                # Stripe webhook handler
│   ├── auth/
│   │   ├── callback/               # OAuth callback handler
│   │   └── auth-code-error/        # Auth error page
│   ├── cart/                       # Shopping cart page
│   ├── checkout/                   # Checkout page
│   ├── success/                    # Payment success page
│   ├── components/                 # React components
│   ├── globals.css                 # Global styles with theme
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Homepage
├── lib/
│   ├── supabase/                   # Supabase utilities
│   ├── types/                      # TypeScript types
│   └── stripe.ts                   # Stripe configuration
├── middleware.ts                   # Next.js middleware
└── DATABASE_SCHEMA.md              # Database schema and setup
```

## Key Features

### Authentication Flow

1. User clicks "Sign In with Google"
2. Redirected to Google OAuth
3. After approval, redirected to `/auth/callback`
4. User data synced to `customers` table
5. Session stored in cookies

### Checkout Flow

1. User proceeds to checkout
2. Payment intent created via `/api/create-payment-intent`
3. Order created in database with "pending" status
4. Stripe Elements displays payment form
5. Payment processed securely
6. Webhook updates order status to "completed"
7. User redirected to success page

## Testing Payments

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date and any 3-digit CVC

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy
5. Update Stripe webhook URL to production URL
6. Update Supabase redirect URL to production URL

## License

MIT
