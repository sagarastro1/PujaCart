'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, Circle, Package, Truck, MapPin, Home } from 'lucide-react';

const OrderSteps = [
  { id: 'placed', label: 'Order Placed', icon: CheckCircle },
  { id: 'packed', label: 'Packed', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { id: 'delivered', label: 'Delivered', icon: Home },
];

interface OrderTrackingData {
  id: string;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
  address: string;
  items: any[];
}

export default function OrderTrackingPage() {
  const [order, setOrder] = useState<OrderTrackingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');

    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, []);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner">Loading order details...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Order not found</p>
        </div>
        <Footer />
      </>
    );
  }

  const currentStepIndex = OrderSteps.findIndex((step) => step.id === order.status);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-responsive max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Order Tracking</h1>

          <div className="card p-8">
            {/* Header */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-2">Order {order.id}</h2>
              <p className="text-gray-600">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Timeline */}
            <div className="mb-12">
              <div className="space-y-8">
                {OrderSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.id} className="flex gap-8">
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <StepIcon size={24} />
                        </div>
                        {index < OrderSteps.length - 1 && (
                          <div
                            className={`w-1 h-16 ${
                              isCompleted ? 'bg-green-400' : 'bg-gray-300'
                            }`}
                          ></div>
                        )}
                      </div>

                      {/* Step Details */}
                      <div className="pb-8 flex-1">
                        <h3 className={`text-lg font-bold ${
                          isCompleted ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </h3>
                        {isCurrent && (
                          <p className="text-saffron font-semibold mt-1">In Progress</p>
                        )}
                        {isCompleted && index < currentStepIndex && (
                          <p className="text-green-600 font-semibold mt-1">✓ Completed</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-bold mb-2">Estimated Delivery</h3>
              <p className="text-gray-700">{order.estimatedDelivery}</p>
            </div>

            {/* Delivery Address */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-bold mb-4">Delivery Address</h3>
              <p className="text-gray-700">{order.address}</p>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-bold mb-4">Items in this Order</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b">
                    <span>{item.name} x {item.quantity}</span>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
