import { supabase } from './supabase';
import type { Database } from './database.types';

// Types
export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
};

// Generate a unique tracking ID
export const generateTrackingId = () => {
  return 'HH-' + Math.random().toString(36).substring(2, 9).toUpperCase();
};

// Products API
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data;
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id);
  
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  
  // Return null if no product found or the first product if found
  return data && data.length > 0 ? data[0] : null;
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at'>): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating product:', error);
    return null;
  }
  
  return data;
};

export const updateProduct = async (id: number, updates: Partial<Product>): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating product:', error);
    return null;
  }
  
  return data;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }
  
  return true;
};

// Orders API
export const getOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  
  return data;
};

export const getOrderById = async (id: number): Promise<OrderWithItems | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }
  
  // Get order items
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('order_id', id);
  
  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    return null;
  }
  
  return { ...data, items: orderItems as any };
};

export const getOrderByTrackingId = async (trackingId: string): Promise<OrderWithItems | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('tracking_id', trackingId)
    .single();
  
  if (error) {
    console.error('Error fetching order by tracking ID:', error);
    return null;
  }
  
  // Get order items
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('order_id', data.id);
  
  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    return null;
  }
  
  return { ...data, items: orderItems as any };
};

export const createOrder = async (
  orderData: Omit<Order, 'id' | 'created_at' | 'tracking_id'>,
  orderItems: Omit<OrderItem, 'id' | 'order_id'>[]
): Promise<{ orderId: number; trackingId: string } | null> => {
  // Generate tracking ID
  const trackingId = generateTrackingId();
  
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{ ...orderData, tracking_id: trackingId, status: 'pending' }])
    .select()
    .single();
  
  if (orderError) {
    console.error('Error creating order:', orderError);
    return null;
  }
  
  // Create order items
  const itemsWithOrderId = orderItems.map(item => ({
    ...item,
    order_id: order.id
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsWithOrderId);
  
  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    // We should ideally roll back the order creation here
    return null;
  }
  
  return { orderId: order.id, trackingId };
};

export const updateOrderStatus = async (id: number, status: Order['status']): Promise<boolean> => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }
  
  return true;
};