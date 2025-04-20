import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, ShoppingBag, Package, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { getOrders, getProducts, type Order, type Product } from '../../lib/api';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [ordersData, productsData] = await Promise.all([
          getOrders(),
          getProducts(),
        ]);
        
        setOrders(ordersData);
        setProducts(productsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Mock data for development
    if (import.meta.env.DEV) {
      setTimeout(() => {
        if (orders.length === 0) {
          setOrders([
            {
              id: 1,
              buyer_name: 'John Doe',
              contact_information: 'Email: john@example.com, Phone: 555-123-4567',
              delivery_address: '123 Main St, Anytown, 12345',
              status: 'pending',
              created_at: new Date().toISOString(),
              tracking_id: 'HH-ABC123',
            },
            {
              id: 2,
              buyer_name: 'Jane Smith',
              contact_information: 'Email: jane@example.com, Phone: 555-987-6543',
              delivery_address: '456 Oak St, Somewhere, 67890',
              status: 'in_progress',
              created_at: new Date(Date.now() - 86400000).toISOString(),
              tracking_id: 'HH-DEF456',
            },
            {
              id: 3,
              buyer_name: 'Bob Johnson',
              contact_information: 'Email: bob@example.com, Phone: 555-555-5555',
              delivery_address: '789 Pine St, Nowhere, 24680',
              status: 'delivered',
              created_at: new Date(Date.now() - 172800000).toISOString(),
              tracking_id: 'HH-GHI789',
            },
          ]);
        }
        
        if (products.length === 0) {
          setProducts([
            {
              id: 1,
              name: 'Fresh Apples',
              price: 2.99,
              image_url: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg',
              description: 'Sweet and juicy apples perfect for snacking or baking.',
              category: 'fruit',
              created_at: new Date().toISOString(),
            },
            {
              id: 2,
              name: 'Organic Carrots',
              price: 1.49,
              image_url: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
              description: 'Crunchy, sweet carrots grown without pesticides.',
              category: 'vegetable',
              created_at: new Date().toISOString(),
            },
          ]);
        }
        
        setIsLoading(false);
      }, 1000);
    }
  }, []);

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const inProgressOrders = orders.filter(order => order.status === 'in_progress').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const totalProducts = products.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Delivered Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{deliveredOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Recent Orders</CardTitle>
              <Link to="/admin/orders">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Tracking ID</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Customer</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.tracking_id}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{order.buyer_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Order Status Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Order Status Breakdown</CardTitle>
              <div className="p-2 rounded-md bg-gray-100">
                <BarChart3 className="h-5 w-5 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="pt-4">
                <div className="h-64 flex items-end justify-around gap-3">
                  <div className="flex flex-col items-center">
                    <div className="bg-amber-500 w-16 rounded-t-md" style={{ height: `${(pendingOrders / Math.max(totalOrders, 1)) * 200}px` }}></div>
                    <p className="mt-2 text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-lg font-bold text-gray-900">{pendingOrders}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-500 w-16 rounded-t-md" style={{ height: `${(inProgressOrders / Math.max(totalOrders, 1)) * 200}px` }}></div>
                    <p className="mt-2 text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-lg font-bold text-gray-900">{inProgressOrders}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-green-500 w-16 rounded-t-md" style={{ height: `${(deliveredOrders / Math.max(totalOrders, 1)) * 200}px` }}></div>
                    <p className="mt-2 text-sm font-medium text-gray-600">Delivered</p>
                    <p className="text-lg font-bold text-gray-900">{deliveredOrders}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;