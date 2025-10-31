// Types para a API
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  image_url?: string;
  created_at: string;
}

export interface ProductCreate {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  image_url?: string;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product_name: string;
  product_price: number;
  total_price: number;
}

export interface CartItemCreate {
  product_id: number;
  quantity: number;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderCreate {
  shipping_address: string;
  payment_method: string;
}

// Context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  clearCart: () => void;
  isLoading: boolean;
}
