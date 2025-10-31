import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Filter, Search } from 'lucide-react';
import { Product, Category } from '../types';
import { productsAPI, categoriesAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchTerm]);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (productId: number) => {
    if (!user) {
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Nossos Produtos</h1>
        <p className="text-xl text-gray-600">
          Descubra uma variedade incrível de produtos para você
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="input-field pl-10 appearance-none"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
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

            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-medium ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.stock > 0 ? `${product.stock} em estoque` : 'Sem estoque'}
              </span>
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

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-600">
            Tente ajustar os filtros ou termo de busca
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;

