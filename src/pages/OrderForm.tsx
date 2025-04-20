import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ShoppingBag, Truck, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/CartItem';
import { createOrder, getProductById } from '../lib/api';

type DeliveryFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes: string;
};

const OrderForm: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const [orderStep, setOrderStep] = useState<'cart' | 'delivery'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<DeliveryFormData>();

  const handleContinue = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty. Please add items before proceeding.');
      return;
    }
    setOrderStep('delivery');
  };

  const handleBack = () => {
    setOrderStep('cart');
  };

  const onSubmit = async (data: DeliveryFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Validate that all products in cart exist in the database
      const invalidProducts = [];
      for (const item of items) {
        try {
          const product = await getProductById(item.product.id);
          if (!product) {
            invalidProducts.push(item.product.name);
          }
        } catch (error) {
          console.error(`Error checking product ${item.product.name}:`, error);
          invalidProducts.push(item.product.name);
        }
      }
      
      // If any products are invalid, show error and return
      if (invalidProducts.length > 0) {
        toast.error(`Some products in your cart are no longer available: ${invalidProducts.join(', ')}`);
        setIsSubmitting(false);
        return;
      }
      
      // Prepare order data
      const orderData = {
        buyer_name: data.name,
        contact_information: `Email: ${data.email}, Phone: ${data.phone}`,
        delivery_address: `${data.address}, ${data.city}, ${data.zipCode}`,
        status: 'pending' as const
      };
      
      // Prepare order items
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_purchase: item.product.price,
      }));
      
      // Create order
      const result = await createOrder(orderData, orderItems);
      
      if (result) {
        setTrackingId(result.trackingId);
        clearCart();
        toast.success('Order placed successfully!');
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewTracking = () => {
    if (trackingId) {
      navigate(`/tracking?id=${trackingId}`);
    }
  };

  if (trackingId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center text-green-700">
              <Truck className="mr-2 h-6 w-6" />
              Order Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <ShoppingBag className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You For Your Order!</h2>
              <p className="text-gray-600 mb-4">
                Your order has been received and is now being processed.
              </p>
              <div className="border border-gray-200 rounded-md p-4 mb-6 bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">Your tracking ID:</p>
                <p className="text-lg font-medium">{trackingId}</p>
              </div>
              <Button onClick={handleViewTracking} className="mt-2">
                Track Your Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Order Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className={`flex items-center text-lg font-medium ${orderStep === 'cart' ? 'text-green-600' : 'text-gray-500'}`}>
            <span className={`flex items-center justify-center h-8 w-8 rounded-full ${orderStep === 'cart' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'} mr-2`}>
              1
            </span>
            Cart
          </div>
          <div className={`h-0.5 w-16 sm:w-24 mx-2 ${orderStep === 'delivery' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center text-lg font-medium ${orderStep === 'delivery' ? 'text-green-600' : 'text-gray-500'}`}>
            <span className={`flex items-center justify-center h-8 w-8 rounded-full ${orderStep === 'delivery' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'} mr-2`}>
              2
            </span>
            Delivery
          </div>
        </div>
      </div>

      {orderStep === 'cart' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Add items to your cart to place a bulk order.</p>
                    <Button onClick={() => navigate('/')}>
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <CartItem key={item.product.id} item={item} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-lg font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  isFullWidth 
                  onClick={handleContinue}
                  disabled={items.length === 0}
                >
                  Continue to Delivery
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleBack}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle>Delivery Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      {...register('name', { required: 'Name is required' })}
                      error={errors.name?.message}
                      fullWidth
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: 'Invalid email address',
                        },
                      })}
                      error={errors.email?.message}
                      fullWidth
                    />
                  </div>
                  
                  <div className="grid grid-cols-1">
                    <Input
                      label="Phone Number"
                      {...register('phone', { required: 'Phone number is required' })}
                      error={errors.phone?.message}
                      fullWidth
                    />
                  </div>
                  
                  <div className="grid grid-cols-1">
                    <Input
                      label="Delivery Address"
                      {...register('address', { required: 'Address is required' })}
                      error={errors.address?.message}
                      fullWidth
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="City"
                      {...register('city', { required: 'City is required' })}
                      error={errors.city?.message}
                      fullWidth
                    />
                    <Input
                      label="ZIP Code"
                      {...register('zipCode', { required: 'ZIP code is required' })}
                      error={errors.zipCode?.message}
                      fullWidth
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Additional Notes (Optional)"
                      {...register('notes')}
                      type="textarea"
                      className="h-32 resize-none"
                      fullWidth
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      type="submit"
                      isFullWidth
                      isLoading={isSubmitting}
                    >
                      Place Order
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center py-2">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity} × ${item.product.price.toFixed(2)}</p>
                      </div>
                      <p className="text-sm font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-lg font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;