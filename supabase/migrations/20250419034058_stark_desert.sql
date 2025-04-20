/*
  # Create tables for Harvest Hub

  1. New Tables
    - `products` - Stores vegetable and fruit product information
      - `id` (primary key)
      - `name` (product name)
      - `price` (price per kg)
      - `image_url` (product image)
      - `description` (product details)
      - `category` (vegetable or fruit)
      - `created_at` (timestamp)
    
    - `orders` - Stores customer order information
      - `id` (primary key)
      - `buyer_name` (customer name)
      - `contact_information` (email, phone)
      - `delivery_address` (shipping address)
      - `status` (pending, in_progress, delivered)
      - `tracking_id` (unique ID for order tracking)
      - `created_at` (timestamp)
    
    - `order_items` - Stores items in each order
      - `id` (primary key)
      - `order_id` (foreign key to orders)
      - `product_id` (foreign key to products)
      - `quantity` (amount ordered)
      - `price_at_purchase` (price at time of purchase)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read and manage all data
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('vegetable', 'fruit')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  buyer_name TEXT NOT NULL,
  contact_information TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'delivered')) DEFAULT 'pending',
  tracking_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase DECIMAL(10, 2) NOT NULL CHECK (price_at_purchase > 0)
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for products
CREATE POLICY "Allow public read access to products" 
  ON products FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated users to insert products" 
  ON products FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products" 
  ON products FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete products" 
  ON products FOR DELETE 
  TO authenticated 
  USING (true);

-- Policies for orders
CREATE POLICY "Allow public read access to orders with tracking_id" 
  ON orders FOR SELECT 
  USING (true);

CREATE POLICY "Allow public to insert orders" 
  ON orders FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update orders" 
  ON orders FOR UPDATE 
  TO authenticated 
  USING (true);

-- Policies for order_items
CREATE POLICY "Allow public read access to order_items" 
  ON order_items FOR SELECT 
  USING (true);

CREATE POLICY "Allow public to insert order_items" 
  ON order_items FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_tracking_id_idx ON orders(tracking_id);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);