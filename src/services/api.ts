import axios from 'axios';
import { 
  User, 
  UserCreate, 
  UserLogin, 
  Token, 
  Category, 
  CategoryCreate, 
  Product, 
  ProductCreate, 
  CartItem, 
  CartItemCreate, 
  Order, 
  OrderCreate 
} from '../types';

const API_BASE_URL = 'http://localhost:8000';

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: UserLogin): Promise<Token> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: UserCreate): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  create: async (category: CategoryCreate): Promise<Category> => {
    const response = await api.post('/categories', category);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (categoryId?: number): Promise<Product[]> => {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (product: ProductCreate): Promise<Product> => {
    const response = await api.post('/products', product);
    return response.data;
  },
};

// Cart API
export const cartAPI = {
  getItems: async (): Promise<CartItem[]> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addItem: async (item: CartItemCreate): Promise<CartItem> => {
    const response = await api.post('/cart/add', item);
    return response.data;
  },

  removeItem: async (itemId: number): Promise<void> => {
    await api.delete(`/cart/${itemId}`);
  },
};

// Orders API
export const ordersAPI = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },

  create: async (order: OrderCreate): Promise<Order> => {
    const response = await api.post('/orders/checkout', order);
    return response.data;
  },
};

export default api;
