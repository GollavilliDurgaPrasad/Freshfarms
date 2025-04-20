import React, { useState, useEffect } from 'react';
import { ChevronDown, Filter, MoreHorizontal, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import Select from '../../components/ui/Select';
import { getOrders, updateOrderStatus, getOrderById, type Order, type OrderWithItems } from '../../lib/api';
import toast from 'react-hot-toast';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');

  useEffect(() => {
    fetchOrders();
    
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
          setIsLoading(false);
        }
      }, 1000);
    }
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrderDetails = async (orderId: number) => {
    try {
      const order = await getOrderById(orderId);
      if (order) {
        setSelectedOrder(order);
        setIsViewingDetails(true);
      } else {
        toast.error('Failed to load order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: Order['status']) => {
    setIsUpdating(true);
    try {
      const success = await updateOrderStatus(orderId, newStatus);
      
      if (success) {
        // Update local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        
        // If viewing details, update selected order
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const closeOrderDetails = () => {
    setIsViewingDetails(false);
    setSelectedOrder(null);
  };

  // Filter orders by status
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        
        <div className="mt-4 sm:mt-0 flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <Select
            options={[
              { value: 'all', label: 'All Orders' },
              { value: 'pending', label: 'Pending' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'delivered', label: 'Delivered' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'all')}
            className="w-40"
          />
          <Button 
            variant="outline" 
            className="ml-4"
            onClick={() => fetchOrders()}
          >
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Tracking ID</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Customer</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
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
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <div className="relative inline-block text-left">
                              <select
                                className="appearance-none bg-transparent text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order['status'])}
                                disabled={isUpdating}
                              >
                                <option value={order.status}>Update Status</option>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="delivered">Delivered</option>
                              </select>
                              <ChevronDown className="absolute right-0 top-1 h-4 w-4 text-gray-500" />
                            </div>
                            <button
                              className="text-blue-600 hover:text-blue-800 focus:outline-none"
                              onClick={() => handleViewOrderDetails(order.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Order Details Modal */}
          {isViewingDetails && selectedOrder && (
            <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="order-details-modal" role="dialog">
              <div className="flex items-center justify-center min-h-screen text-center">
                <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" onClick={closeOrderDetails}></div>
                <div className="relative inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Order Details - {selectedOrder.tracking_id}
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={closeOrderDetails}
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Order Information</h4>
                      <p className="text-sm"><span className="font-medium">Status:</span> <StatusBadge status={selectedOrder.status} /></p>
                      <p className="text-sm mt-2"><span className="font-medium">Date:</span> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h4>
                      <p className="text-sm"><span className="font-medium">Name:</span> {selectedOrder.buyer_name}</p>
                      <p className="text-sm mt-1"><span className="font-medium">Contact:</span> {selectedOrder.contact_information}</p>
                      <p className="text-sm mt-1"><span className="font-medium">Delivery Address:</span> {selectedOrder.delivery_address}</p>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="px-4 py-2 text-sm font-medium text-gray-500">Product</th>
                          <th className="px-4 py-2 text-sm font-medium text-gray-500">Quantity</th>
                          <th className="px-4 py-2 text-sm font-medium text-gray-500">Price</th>
                          <th className="px-4 py-2 text-sm font-medium text-gray-500">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id} className="border-b border-gray-200">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                                  <img
                                    src={item.product.image_url}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="ml-3">
                                  <p className="font-medium">{item.product.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">${item.price_at_purchase.toFixed(2)}/kg</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              ${(item.quantity * item.price_at_purchase).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-gray-200">
                          <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-500 text-right">Total:</td>
                          <td className="px-4 py-3 text-base font-bold text-gray-900">
                            ${selectedOrder.items.reduce((total, item) => total + (item.quantity * item.price_at_purchase), 0).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <div className="flex space-x-4">
                      <Button
                        variant={selectedOrder.status === 'pending' ? 'primary' : 'outline'}
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'pending')}
                        disabled={isUpdating || selectedOrder.status === 'pending'}
                      >
                        Mark as Pending
                      </Button>
                      <Button
                        variant={selectedOrder.status === 'in_progress' ? 'primary' : 'outline'}
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'in_progress')}
                        disabled={isUpdating || selectedOrder.status === 'in_progress'}
                      >
                        Mark as In Progress
                      </Button>
                      <Button
                        variant={selectedOrder.status === 'delivered' ? 'primary' : 'outline'}
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                        disabled={isUpdating || selectedOrder.status === 'delivered'}
                      >
                        Mark as Delivered
                      </Button>
                    </div>
                    <Button variant="outline" onClick={closeOrderDetails}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminOrders;