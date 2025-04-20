import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Filter } from "lucide-react";
import ProductCard from "../components/ProductCard";
import Button from "../components/ui/Button";
import { getProducts, type Product } from "../lib/api";
import { useCart } from "../contexts/CartContext";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<"all" | "vegetable" | "fruit">(
    "all"
  );
  const { totalItems } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    // For demo purposes, let's add some mock data if the database is empty
    if (import.meta.env.DEV) {
      setTimeout(() => {
        if (products.length === 0) {
          setProducts([
            {
              id: 1,
              name: "Fresh Apples",
              price: 20.0,
              image_url:
                "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg",
              description:
                "Sweet and juicy apples perfect for snacking or baking.",
              category: "fruit",
              created_at: new Date().toISOString(),
            },
            {
              id: 2,
              name: "Organic Carrots",
              price: 7.0,
              image_url:
                "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg",
              description: "Crunchy, sweet carrots grown without pesticides.",
              category: "vegetable",
              created_at: new Date().toISOString(),
            },
            {
              id: 3,
              name: "Ripe Bananas",
              price: 5.0,
              image_url:
                "https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg",
              description: "Perfect for smoothies, baking, or eating fresh.",
              category: "fruit",
              created_at: new Date().toISOString(),
            },
            {
              id: 4,
              name: "Fresh Tomatoes",
              price: 10.0,
              image_url:
                "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg",
              description:
                "Juicy, flavorful tomatoes perfect for salads and cooking.",
              category: "vegetable",
              created_at: new Date().toISOString(),
            },
            {
              id: 5,
              name: "Green Spinach",
              price: 20.0,
              image_url:
                "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg",
              description:
                "Fresh, nutrient-rich spinach leaves for salads and cooking.",
              category: "vegetable",
              created_at: new Date().toISOString(),
            },
            {
              id: 6,
              name: "Juicy Oranges",
              price: 10.0,
              image_url:
                "https://vinyasayogaacademy.com/blog/wp-content/uploads/2020/03/Benefits-of-Drinking-Orange-Juice-every-morning.jpg",
              description: "Sweet and tangy oranges packed with vitamin C.",
              category: "fruit",
              created_at: new Date().toISOString(),
            },
            {
              id: 7,
              name: "Onion",
              price: 20.0,
              image_url:
                "https://produits.bienmanger.com/36700-0w470h470_Organic_Red_Onion_From_Italy.jpg",
              description:
                "Fresh, nutrient-rich spinach leaves for salads and cooking.",
              category: "vegetable",
              created_at: new Date().toISOString(),
            },
            {
              id: 8,
              name: "Capsicum",
              price: 40.0,
              image_url:
                "https://img1.exportersindia.com/product_images/bc-full/2018/9/3059980/green-capsicum-1537956400-4339803.jpeg",
              description:
                "Fresh, nutrient-rich spinach leaves for salads and cooking..",
              category: "vegetable",
              created_at: new Date().toISOString(),
            },
            {
              id: 9,
              name: "Watermelon",
              price: 25.0,
              image_url:
                "https://media.istockphoto.com/id/1496179914/photo/watermelon-slice-in-the-summer.jpg?s=612x612&w=0&k=20&c=-dEIRWjVtoyXxJiEXJSLj7MfoiNVlGXo4ku6ckZX1eQ=",
              description: "Sweet and tangy oranges packed with vitamin C.",
              category: "fruit",
              created_at: new Date().toISOString(),
            },
          ]);
          setIsLoading(false);
        }
      }, 1000);
    }
  }, []);

  const filteredProducts =
    category === "all"
      ? products
      : products.filter((product) => product.category === category);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-green-700 px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/1508666/pexels-photo-1508666.jpeg"
            alt="Fresh produce"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-transparent mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Fresh Produce, Wholesale Prices
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-green-100">
            Order fresh vegetables and fruits in bulk directly from local farms
            to your doorstep.
          </p>
          <div className="mt-10 flex justify-center">
            <Link to="/order">
              <Button size="lg">
                <div className="flex row space-around">
                  <ShoppingCart className="mr-2 h-7 w-5" />
                  Place Bulk Order
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Product Catalog */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Our Products</h2>

          <div className="mt-4 sm:mt-0 flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <span className="mr-2 text-sm text-gray-500">Filter:</span>
            <div className="flex space-x-2">
              <Button
                variant={category === "all" ? "primary" : "outline"}
                size="sm"
                onClick={() => setCategory("all")}
              >
                All
              </Button>
              <Button
                variant={category === "vegetable" ? "primary" : "outline"}
                size="sm"
                onClick={() => setCategory("vegetable")}
              >
                Vegetables
              </Button>
              <Button
                variant={category === "fruit" ? "primary" : "outline"}
                size="sm"
                onClick={() => setCategory("fruit")}
              >
                Fruits
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No products found. Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}

        {totalItems > 0 && (
          <div className="fixed bottom-6 right-6">
            <Link to="/order">
              <Button size="lg" className="flex items-center shadow-lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                View Cart ({totalItems})
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
