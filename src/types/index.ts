export interface Store {
  id: string;
  name: string;
  location: string;
  address?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  size?: string;
  color?: string;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
  store?: Store;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}