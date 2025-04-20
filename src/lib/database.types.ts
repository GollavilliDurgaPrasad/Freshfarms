export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          name: string
          price: number
          image_url: string
          description: string
          category: 'vegetable' | 'fruit'
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          price: number
          image_url: string
          description: string
          category: 'vegetable' | 'fruit'
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          price?: number
          image_url?: string
          description?: string
          category?: 'vegetable' | 'fruit'
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: number
          buyer_name: string
          contact_information: string
          delivery_address: string
          status: 'pending' | 'in_progress' | 'delivered'
          created_at: string
          tracking_id: string
        }
        Insert: {
          id?: number
          buyer_name: string
          contact_information: string
          delivery_address: string
          status?: 'pending' | 'in_progress' | 'delivered'
          created_at?: string
          tracking_id?: string
        }
        Update: {
          id?: number
          buyer_name?: string
          contact_information?: string
          delivery_address?: string
          status?: 'pending' | 'in_progress' | 'delivered'
          created_at?: string
          tracking_id?: string
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          product_id: number
          quantity: number
          price_at_purchase: number
        }
        Insert: {
          id?: number
          order_id: number
          product_id: number
          quantity: number
          price_at_purchase: number
        }
        Update: {
          id?: number
          order_id?: number
          product_id?: number
          quantity?: number
          price_at_purchase?: number
        }
      }
    }
  }
}