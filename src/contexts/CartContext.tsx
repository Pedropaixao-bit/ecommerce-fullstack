import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CartContextType } from '../types';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCartItems();
    } else {
      setItems([]);
    }
  }, [user]);

  const loadCartItems = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const cartItems = await cartAPI.getItems();
      setItems(cartItems);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (!user) {
      toast.error('Faça login para adicionar produtos ao carrinho');
      return;
    }

    try {
      setIsLoading(true);
      const newItem = await cartAPI.addItem({ product_id: productId, quantity });
      
      // Atualizar lista local
      const existingItemIndex = items.findIndex(item => item.product_id === productId);
      if (existingItemIndex >= 0) {
        const updatedItems = [...items];
        updatedItems[existingItemIndex] = newItem;
        setItems(updatedItems);
      } else {
        setItems([...items, newItem]);
      }
      
      toast.success('Produto adicionado ao carrinho!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao adicionar ao carrinho');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setIsLoading(true);
      await cartAPI.removeItem(itemId);
      
      setItems(items.filter(item => item.id !== itemId));
      toast.success('Produto removido do carrinho!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao remover do carrinho');
    } finally {
      setIsLoading(false);
    }
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.total_price, 0);
  };

  const getCartItemsCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => {
    setItems([]);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    getCartTotal,
    getCartItemsCount,
    clearCart,
    isLoading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
