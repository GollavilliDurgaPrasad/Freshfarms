import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { getProducts, createProduct, updateProduct, deleteProduct, type Product } from '../../lib/api';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

type ProductFormData = {
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: 'vegetable' | 'fruit';
};

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormData>();

  useEffect(() => {
    fetchProducts();
    
    // Mock data for development
    if (import.meta.env.DEV) {
      setTimeout(() => {
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
            {
              id: 3,
              name: 'Ripe Bananas',
              price: 0.99,
              image_url: 'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg',
              description: 'Perfect for smoothies, baking, or eating fresh.',
              category: 'fruit',
              created_at: new Date().toISOString(),
            },
          ]);
          setIsLoading(false);
        }
      }, 1000);
    }
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditProductId(null);
    reset({
      name: '',
      price: 0,
      description: '',
      image_url: '',
      category: 'vegetable',
    });
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditProductId(product.id);
    setValue('name', product.name);
    setValue('price', product.price);
    setValue('description', product.description);
    setValue('image_url', product.image_url);
    setValue('category', product.category);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const success = await deleteProduct(productId);
      
      if (success) {
        setProducts(products.filter(product => product.id !== productId));
        toast.success('Product deleted successfully');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditProductId(null);
    reset();
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    
    try {
      if (editProductId) {
        // Update existing product
        const updatedProduct = await updateProduct(editProductId, data);
        
        if (updatedProduct) {
          setProducts(prevProducts => 
            prevProducts.map(product => 
              product.id === editProductId ? updatedProduct : product
            )
          );
          toast.success('Product updated successfully');
          closeForm();
        } else {
          toast.error('Failed to update product');
        }
      } else {
        // Create new product
        const newProduct = await createProduct(data);
        
        if (newProduct) {
          setProducts([...products, newProduct]);
          toast.success('Product added successfully');
          closeForm();
        } else {
          toast.error('Failed to add product');
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Product Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>{editProductId ? 'Edit Product' : 'Add New Product'}</CardTitle>
            <button 
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={closeForm}
            >
              <X className="h-5 w-5" />
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Product Name"
                  {...register('name', { required: 'Name is required' })}
                  error={errors.name?.message}
                  fullWidth
                />
                <Input
                  label="Price ($ per kg)"
                  type="number"
                  step="0.01"
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0.01, message: 'Price must be positive' },
                    valueAsNumber: true,
                  })}
                  error={errors.price?.message}
                  fullWidth
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Image URL"
                  {...register('image_url', { required: 'Image URL is required' })}
                  error={errors.image_url?.message}
                  fullWidth
                />
                <Select
                  label="Category"
                  options={[
                    { value: 'vegetable', label: 'Vegetable' },
                    { value: 'fruit', label: 'Fruit' },
                  ]}
                  {...register('category', { required: 'Category is required' })}
                  error={errors.category?.message}
                  fullWidth
                />
              </div>
              
              <div>
                <Input
                  label="Description"
                  {...register('description', { required: 'Description is required' })}
                  as="textarea"
                  className="h-32 resize-none"
                  error={errors.description?.message}
                  fullWidth
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={closeForm}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  isLoading={isSubmitting}
                >
                  {editProductId ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="h-full">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <span className="font-medium text-green-600">${product.price.toFixed(2)}/kg</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {product.category === 'vegetable' ? 'Vegetable' : 'Fruit'}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      className="p-1 text-gray-400 hover:text-blue-600"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-red-600"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {products.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No products found. Click 'Add Product' to create your first product.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;