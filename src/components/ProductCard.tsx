import React from 'react';
import { Plus, Minus } from 'lucide-react';
import Button from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../lib/api';

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items, updateQuantity, removeItem } = useCart();
  
  const cartItem = items.find(item => item.product.id === product.id);
  const isInCart = !!cartItem;
  
  const handleAddToCart = () => {
    addItem(product, 1);
  };
  
  const handleIncreaseQuantity = () => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    }
  };
  
  const handleDecreaseQuantity = () => {
    if (cartItem) {
      if (cartItem.quantity === 1) {
        removeItem(product.id);
      } else {
        updateQuantity(product.id, cartItem.quantity - 1);
      }
    }
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg">
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <span className="font-medium text-green-600">&#8377;{product.price.toFixed(2)}/kg</span>
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
        
        <div className="mt-4">
          {isInCart ? (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDecreaseQuantity}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium">{cartItem.quantity}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleIncreaseQuantity}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleAddToCart} 
              variant="primary" 
              size="sm" 
              isFullWidth
            >
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;