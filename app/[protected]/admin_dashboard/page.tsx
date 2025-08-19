"use client"
import { DataTableDemo } from "@/components/table";
import { use, useEffect, useState } from "react";

interface CartResponse {
  id: string;
  customerId: string;
  items: {
    id: string;
    productId: string;
    quantity: number;
    variantId: string;
  }[];
}
interface Order{

  id: number;
  customerId: string;
  total_amount: number;
  status: string;
  items: {
    id: string;
    productVariantId: number;
    quantity: number;
    orderId: number;
  }[];
}

// interface Cart {
// carts:CartResponse[]
// }

export default function AdminDashboard() {
  const [carts, setCarts] = useState<CartResponse[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Loading dashboard data...");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setLoadingMessage("Loading cart data...");
        setLoadingProgress(30);

        // Fetch carts
        // const cartsResponse = await fetch('/api/carts');
        // if (!cartsResponse.ok) {
        //   throw new Error('Failed to fetch carts');
        // }
        // const cartsData = await cartsResponse.json();
        // setCarts(cartsData.carts);
        setLoadingProgress(50);
        setLoadingMessage("Loading order data...");

        // Fetch orders
        const ordersResponse = await fetch('/api/orders');
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders');
        }
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders);
        setLoadingProgress(80);
        setLoadingMessage("Finalizing dashboard...");

        // Simulate additional processing time
        await new Promise(resolve => setTimeout(resolve, 300));
        setLoadingProgress(100);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ 
            backgroundImage: "url('/assets/i2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            filter: "blur(2px)"
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Loading Content */}
        <div className="relative z-10 w-full max-w-md p-6 bg-white bg-opacity-90 rounded-2xl shadow-xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading Admin Dashboard</h1>
            <p className="text-gray-600 mb-6">{loadingMessage}</p>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">{loadingProgress}% complete</p>
            
            {loadingProgress === 100 && (
              <p className="mt-4 text-green-600 animate-pulse">Almost ready...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/assets/i2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      ></div>
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl p-6">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="mt-3 text-lg text-gray-600">Welcome to the admin dashboard!</p>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <a href="/add_product">
              <button className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all">
                Add New Product
              </button>
            </a>
            <a href="/manage_products">
              <button className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all">
                Manage Products
              </button>
            </a>
          </div>

          <div className="mt-10">
            <DataTableDemo carts={carts} orders={orders} />
          </div>
        </div>
      </div>
    </div>
  );
}