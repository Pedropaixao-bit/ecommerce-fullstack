import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Star, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      loadProduct(Number(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    try {
      const productData = await productsAPI.getById(productId);
      setProduct(productData);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    if (product) {
      await addToCart(product.id, quantity);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Produto não encontrado
        </h3>
        <Link to="/products" className="text-primary-600 hover:text-primary-700">
          Voltar para produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to="/" className="hover:text-primary-600">Início</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary-600">Produtos</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-9">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-2">(4.5)</span>
              </div>
              <span className={`text-sm font-medium ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.stock > 0 ? `${product.stock} em estoque` : 'Sem estoque'}
              </span>
            </div>

            <div className="text-4xl font-bold text-primary-600 mb-6">
              R$ {product.price.toFixed(2)}
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Quantidade:
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Sem Estoque' : 'Adicionar ao Carrinho'}
              </button>
              <Link
                to="/cart"
                className="btn-secondary"
              >
                Ver Carrinho
              </Link>
            </div>
          </div>

          {/* Product Features */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Características do Produto
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Produto de alta qualidade</li>
              <li>• Entrega rápida e segura</li>
              <li>• Garantia de satisfação</li>
              <li>• Suporte ao cliente 24/7</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-start">
        <Link
          to="/products"
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para produtos</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;


