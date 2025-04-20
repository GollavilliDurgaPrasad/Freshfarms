import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Truck, ArrowRight, Package, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import StatusBadge from '../components/ui/StatusBadge';
import { getOrderByTrackingId, type OrderWithItems } from '../lib/api';

const OrderTracking: React.FC = () => {
  const location = useLocation();
  const [trackingId, setTrackingId] = useState('');
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract tracking ID from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setTrackingId(id);
      trackOrder(id);
    }
  }, [location.search]);

  const trackOrder = async (id: string) => {
    if (!id.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const orderData = await getOrderByTrackingId(id);
      if (orderData) {
        setOrder(orderData);
      } else {
        setError('Order not found. Please check your tracking ID.');
        setOrder(null);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Something went wrong. Please try again later.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackOrder(trackingId);
  };

  // For demo purposes, add mock data
  useEffect(() => {
    if (import.meta.env.DEV && trackingId === 'DEMO1234') {
      setOrder({
        id: 1,
        buyer_name: 'John Doe',
        contact_information: 'Email: john@example.com, Phone: 555-123-4567',
        delivery_address: '123 Main St, Anytown, 12345',
        status: 'in_progress',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        tracking_id: 'DEMO1234',
        items: [
          {
            id: 1,
            order_id: 1,
            product_id: 1,
            quantity: 5,
            price_at_purchase: 2.99,
            product: {
              id: 1,
              name: 'Fresh Apples',
              price: 2.99,
              image_url: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg',
              description: 'Sweet and juicy apples perfect for snacking or baking.',
              category: 'fruit',
              created_at: new Date().toISOString(),
            }
          },
          {
            id: 2,
            order_id: 1,
            product_id: 2,
            quantity: 3,
            price_at_purchase: 1.49,
            product: {
              id: 2,
              name: 'Organic Carrots',
              price: 1.49,
              image_url: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
              description: 'Crunchy, sweet carrots grown without pesticides.',
              category: 'vegetable',
              created_at: new Date().toISOString(),
            }
          }
        ]
      });
    }
  }, [trackingId]);

  // Calculate order total
  const orderTotal = order?.items.reduce(
    (total, item) => total + item.quantity * item.price_at_purchase, 
    0
  ) || 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Track Your Order</h1>
        <p className="text-gray-600">Enter your tracking ID to see the current status of your order.</p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter your tracking ID"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              fullWidth
              className="flex-1"
            />
            <Button 
              type="submit" 
              isLoading={isLoading}
              disabled={!trackingId.trim()}
            >
              <div className='flex row space-around'>
              <Search className="mr-2 h-8 w-8 mt-2" />
              Track Order
              </div>
            </Button>
          </form>
          {!trackingId.trim() && !order && (
            <p className="text-sm text-gray-500 mt-4">
              Try our demo tracking ID: <Button variant="ghost" size="sm" onClick={() => setTrackingId('DEMO1234')}>DEMO1234</Button>
            </p>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {order && (
        <div className="space-y-8">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Order Status</span>
                <StatusBadge status={order.status} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute top-0 left-6 h-full w-0.5 bg-gray-200 z-0"></div>
                
                <div className="relative z-10 space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        order.status === 'pending' || order.status === 'in_progress' || order.status === 'delivered' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Package className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Order Received</h3>
                      <p className="text-sm text-gray-500">
                        We've received your order and it's being prepared.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        order.status === 'in_progress' || order.status === 'delivered' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Truck className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Processing</h3>
                      <p className="text-sm text-gray-500">
                        Your order is being processed and prepared for delivery.
                      </p>
                      {(order.status === 'in_progress' || order.status === 'delivered') && (
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(new Date(order.created_at).getTime() + 86400000).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <CheckCircle className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Delivered</h3>
                      <p className="text-sm text-gray-500">
                        Your order has been delivered successfully.
                      </p>
                      {order.status === 'delivered' && (
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(new Date(order.created_at).getTime() + 172800000).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Buyer Information</h3>
                  <p className="text-base">{order.buyer_name}</p>
                  <p className="text-sm text-gray-500 mt-1">{order.contact_information}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Address</h3>
                  <p className="text-base">{order.delivery_address}</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Order Items</h3>
                <div className="border-t border-gray-200">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-4 border-b border-gray-200 flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-base font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × ${item.price_at_purchase.toFixed(2)}/kg
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-medium text-gray-900">
                          ${(item.quantity * item.price_at_purchase).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-right">
                  <p className="text-base text-gray-900">
                    <span className="font-medium">Total: </span>
                    <span className="font-bold">${orderTotal.toFixed(2)}</span>
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Link to="/">
                  <Button>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;