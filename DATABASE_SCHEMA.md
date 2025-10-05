# Database Schema for Ecommerce Store

This document outlines the Supabase database schema required for the ecommerce store.

## Tables

### 1. products
Stores product information for the store catalog.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  inventory_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products
CREATE POLICY "Products are viewable by everyone"
ON products FOR SELECT
USING (true);
```

### 2. customers
Extended customer profile information linked to Supabase auth.users.

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Users can read their own customer data
CREATE POLICY "Users can view their own customer data"
ON customers FOR SELECT
USING (auth.uid() = id);

-- Users can update their own customer data
CREATE POLICY "Users can update their own customer data"
ON customers FOR UPDATE
USING (auth.uid() = id);
```

### 3. orders
Stores order information for purchases.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, cancelled
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (auth.uid() = customer_id);
```

### 4. order_items
Stores individual items within each order.

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL, -- price at time of purchase
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can view order items for their own orders
CREATE POLICY "Users can view their own order items"
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.customer_id = auth.uid()
  )
);
```

## Triggers

### Update updated_at timestamp automatically

```sql
-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for products table
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for customers table
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for orders table
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Sample Data

```sql
-- Insert sample products
INSERT INTO products (name, description, price, image_url, inventory_count) VALUES
('Premium Headphones', 'High-quality wireless headphones with noise cancellation', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 50),
('Smart Watch', 'Feature-rich smartwatch with health tracking', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 30),
('Laptop Backpack', 'Durable backpack with laptop compartment', 79.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 100),
('Wireless Mouse', 'Ergonomic wireless mouse with precision tracking', 49.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 75),
('Mechanical Keyboard', 'RGB mechanical keyboard with tactile switches', 149.99, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', 40),
('USB-C Hub', 'Multi-port USB-C hub for laptops', 59.99, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500', 60);
```

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run each SQL block in order:
   - Create tables
   - Enable RLS policies
   - Create triggers
   - Insert sample data (optional)

4. Configure Authentication:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URL to: `http://localhost:3000/auth/callback`

5. Get your API credentials:
   - Go to Project Settings > API
   - Copy the Project URL and anon/public key
   - Add these to your `.env.local` file
