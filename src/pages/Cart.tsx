import React from React;
import { Link } from react-router-dom;
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from lucide-react;
import { useCart } from ../contexts/CartContext;

const Cart: React.FC = () => {
  const { items, removeFromCart, getCartTotal, getCartItemsCount, isLoading } = useCart();

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
    } else {
      // Aqui você implementaria a atualização da quantidade
      // Por simplicidade, vamos apenas remover se for 0
      if (newQuantity === 0) {
        await removeFromCart(itemId);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Seu carrinho está vazio
        </h3>
        <p className="text-gray-600 mb-6">
          Adicione alguns produtos para começar suas compras
        </p>
        <Link
          to="/products"
          className="btn-primary inline-flex items-center"
        >
          Ver Produtos
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Carrinho de Compras
        </h1>
        <span className="text-gray-600">
          {getCartItemsCount()} {getCartItemsCount() === 1 ? 'item' : 'itens'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card p-6">
              <div className="flex items-center space-x-4">
                {/* Product Image Placeholder */}
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="h-8 w-8 text-gray-400" />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {item.product_name}
                  </h3>
                  <p className="text-primary-600 font-semibold">
                    R$ {item.product_price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Total Price */}
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    R$ {item.total_price.toFixed(2)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Resumo do Pedido
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({getCartItemsCount()} itens)</span>
                <span>R$ {getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span>Grátis</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>R$ {getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/checkout"
                className="w-full btn-primary text-center block"
              >
                Finalizar Compra
              </Link>
              <Link
                to="/products"
                className="w-full btn-secondary text-center block"
              >
                Continuar Comprando
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Garantias
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Entrega rápida e segura</li>
                <li>• Garantia de satisfação</li>
                <li>• Suporte ao cliente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


