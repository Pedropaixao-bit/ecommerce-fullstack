import React, { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { Order } from '../types';
import { ordersAPI } from '../services/api';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const ordersData = await ordersAPI.getAll();
      setOrders(ordersData);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Processando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregue';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum pedido encontrado
        </h3>
        <p className="text-gray-600 mb-6">
          Você ainda não fez nenhum pedido
        </p>
        <button
          onClick={() => window.location.href = '/products'}
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Meus Pedidos
        </h1>
        <span className="text-gray-600">
          {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
        </span>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="card p-6">
            {/* Order Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-gray-400" />
                  <span className="font-semibold text-gray-900">
                    Pedido #{order.id}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {formatDate(order.created_at)}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  R$ {order.total_amount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Endereço de Entrega
                  </span>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  {order.shipping_address}
                </p>
              </div>

              {/* Payment Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Forma de Pagamento
                  </span>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  {order.payment_method === 'credit_card' && 'Cartão de Crédito'}
                  {order.payment_method === 'debit_card' && 'Cartão de Débito'}
                  {order.payment_method === 'pix' && 'PIX'}
                  {order.payment_method === 'boleto' && 'Boleto Bancário'}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Itens do Pedido
              </h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Produto ID: {item.product_id}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantidade: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      R$ {(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Actions */}
            {order.status === 'delivered' && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Pedido entregue com sucesso!
                    </span>
                  </div>
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Avaliar Produtos
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;


