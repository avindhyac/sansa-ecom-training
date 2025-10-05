export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  inventory_count: number
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_id: string | null
  total_amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  stripe_payment_intent_id: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  quantity: number
  price: number
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
      }
      customers: {
        Row: Customer
        Insert: Omit<Customer, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, 'id' | 'created_at'>
        Update: Partial<Omit<OrderItem, 'id' | 'created_at'>>
      }
    }
  }
}
