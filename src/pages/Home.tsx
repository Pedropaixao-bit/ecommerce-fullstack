import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await productsAPI.getAll();
      setFeaturedProducts(products.slice(0, 6)); // Mostrar apenas 6 produtos
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      // Redirecionar para login se não estiver logado
      window.location.href = '/login';
      return;
    }
    await addToCart(productId, 1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bem-vindo ao E-Commerce
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Descubra produtos incríveis com os melhores preços
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Ver Produtos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            {!user && (
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Criar Conta
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Produtos em Destaque</h2>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            Ver todos
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  R$ {product.price.toFixed(2)}
                </span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">4.5</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link
                  to={`/products/${product.id}`}
                  className="flex-1 btn-secondary text-center"
                >
                  Ver Detalhes
                </Link>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="btn-primary"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Sem Estoque' : 'Adicionar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Por que escolher nossa loja?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Produtos de Qualidade
            </h3>
            <p className="text-gray-600">
              Selecionamos apenas os melhores produtos para você
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Atendimento Premium
            </h3>
            <p className="text-gray-600">
              Suporte especializado para todas as suas necessidades
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Entrega Rápida
            </h3>
            <p className="text-gray-600">
              Receba seus produtos no conforto da sua casa
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

