import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">E-Commerce</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Início</span>
              </Link>
              <Link
                to="/products"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/products') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                Produtos
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/orders"
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <User className="h-6 w-6" />
                  </Link>
                  <span className="text-sm text-gray-700">
                    Olá, {user.username}
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Sair</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 E-Commerce. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

