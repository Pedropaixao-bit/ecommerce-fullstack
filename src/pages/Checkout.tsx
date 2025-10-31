import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

const Checkout: React.FC = () => {
  const [formData, setFormData] = useState({
    shipping_address: '',
    payment_method: 'credit_card',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.shipping_address.trim()) {
      toast.error('Por favor, informe o endereço de entrega');
      return;
    }

    setIsLoading(true);

    try {
      await ordersAPI.create(formData);
      clearCart();
      toast.success('Pedido realizado com sucesso!');
      navigate('/orders');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao finalizar pedido');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Carrinho vazio
        </h3>
        <p className="text-gray-600 mb-6">
          Adicione produtos ao carrinho antes de finalizar a compra
        </p>
        <button
          onClick={() => navigate('/products')}
          className="btn-primary"
        >
          Ver Produtos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Finalizar Compra
        </h1>
        <p className="text-gray-600">
          Complete suas informações para finalizar o pedido
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Address */}
            <div className="card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Endereço de Entrega
                </h2>
              </div>
              
              <div>
                <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço Completo *
                </label>
                <textarea
                  id="shipping_address"
                  name="shipping_address"
                  rows={4}
                  required
                  className="input-field"
                  placeholder="Rua, número, bairro, cidade, estado, CEP"
                  value={formData.shipping_address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Forma de Pagamento
                </h2>
              </div>
              
              <div>
                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pagamento *
                </label>
                <select
                  id="payment_method"
                  name="payment_method"
                  required
                  className="input-field"
                  value={formData.payment_method}
                  onChange={handleChange}
                >
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="debit_card">Cartão de Débito</option>
                  <option value="pix">PIX</option>
                  <option value="boleto">Boleto Bancário</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processando...' : 'Finalizar Pedido'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Resumo do Pedido
            </h2>

            {/* Order Items */}
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qtd: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    R$ {item.total_price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span>Grátis</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>R$ {getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="card p-6 bg-green-50 border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="text-sm font-semibold text-green-800">
                Compra Segura
              </h3>
            </div>
            <p className="text-sm text-green-700">
              Seus dados estão protegidos com criptografia SSL. 
              Processamos pagamentos de forma segura e confiável.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


