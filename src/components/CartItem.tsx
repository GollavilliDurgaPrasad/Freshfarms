import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart, type CartItem } from '../contexts/CartContext';

type CartItemProps = {
  item: CartItem;
};

const CartItemComponent: React.FC<CartItemProps> = ({ item }) => {
  const { product, quantity } = item;
  const { updateQuantity, removeItem } = useCart();
  
  const handleIncreaseQuantity = () => {
    updateQuantity(product.id, quantity + 1);
  };
  
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
    }
  };
  
  const handleRemove = () => {
    removeItem(product.id);
  };
  
  const itemTotal = product.price * quantity;

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <h3 className="text-base font-medium text-gray-900">{product.name}</h3>
          <p className="ml-4 text-base font-medium text-gray-900">
            ${itemTotal.toFixed(2)}
          </p>
        </div>
        <p className="mt-1 text-sm text-gray-500">${product.price.toFixed(2)}/kg</p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border rounded">
            <button
              type="button"
              className="p-1 text-gray-600 hover:text-gray-900"
              onClick={handleDecreaseQuantity}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-2 py-1 text-gray-900">{quantity}</span>
            <button
              type="button"
              className="p-1 text-gray-600 hover:text-gray-900"
              onClick={handleIncreaseQuantity}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <button
            type="button"
            className="text-red-500 hover:text-red-700"
            onClick={handleRemove}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemComponent;