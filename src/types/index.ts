export interface User {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'retailer';
}

export interface Shop {
  id: string;
  name: string;
  location: string;
  phone: string;
  retailerId: string;
  category: string;
  coordinates?: { lat: number; lng: number };
}

export interface Product {
  id: string;
  name: string;
  shopId: string;
  price: number;
  description?: string;
  inStock: boolean;
  quantity: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  shopId: string;
  shopName: string;
}

export interface ShopWithProducts {
  shop: Shop;
  products: Product[];
  availableItems?: number;
  hasAllItems?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, type: 'customer' | 'retailer') => Promise<void>;
  register: (name: string, email: string, password: string, type: 'customer' | 'retailer') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
