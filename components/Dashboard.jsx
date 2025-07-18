"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import Profile from "./Profile";
import OrderConfirm from "./OrderConfirm";
import OrderDetail from "./OrderDetail";
import AllOrders from "./AllOrders";
import Chat from "./Chat";

const sections = [
  { key: "orders", label: "Booking" },
  { key: "chatbot", label: "Chat Bot" },
];
const settings = [
  { key: "profile", label: "Profile" },
];

import ChatOrder from "./ChatOrder";
function SectionContent({ section, orderId, onViewOrder, onBackHome, showOrderDetail, selectedOrder, orderChatMode, onChatOrder,onBack }) {
  const { data: session } = useSession()
  const userId = session?.user?.id || session?.user?._id;
  if (section === "profile") return <Profile />;
  if (section === "orders" && selectedOrder && orderChatMode) return <ChatOrder order={selectedOrder} onBack={onBack} onViewOrder={onViewOrder} />;
  if (section === "orders" && selectedOrder) return <OrderDetail order={selectedOrder} onBack={onBack} />;
  if (section === "chatbot") {
    // Pass userId from session to Chat
    // console.log("Rendering Chat with userId:", userId);
    return <Chat userId={userId} />;
  }
  if (section === "orders") return <AllOrders userId={userId} onViewOrder={onViewOrder} onChatOrder={onChatOrder} />;
  if (section === "dashboard" && orderId && !showOrderDetail) {
    return <OrderConfirm orderId={orderId} onViewOrder={onViewOrder} onBackHome={onBackHome} />;
  }
  if (section === "dashboard" && orderId && showOrderDetail) {
    return <OrderDetail orderId={orderId} />;
  }
  if (section === "dashboard") {
    return (
      <div className="p-8 flex items-center justify-center flex-col">
        <h1 className="text-3xl font-bold mb-3">Welcome and Thank You for Choosing Us!</h1>
        <div className="p-6 mb-6 max-w-2xl">
          <p className="text-lg mb-2">Dear <span className="font-semibold text-blue-900">{session?.user?.name || "User"}</span>,</p>
          <p className="mb-4">We’re delighted to welcome you on board!</p>
          <p className="mb-4">Thank you for choosing our platform. We’re thrilled to have you with us and are committed to making your experience smooth, secure, and user-friendly. Your dashboard is now ready and designed to give you quick, easy access to everything you need — all in one place.</p>
          <p className="mb-4">Whether you’re here to explore, manage your services, or simply stay connected, we’ve built this space with your convenience in mind. If you ever need assistance, our team is always here to help.</p>
          <p className="mb-4">We look forward to serving you and being a part of your journey.</p>
          <p className="mt-6 font-semibold">Warm regards,<br/>Himalayan Wellness Retreat Team</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold capitalize">{section}</h1>
      <p className="mt-4 text-gray-600">This is the <b>{section}</b> section content.</p>
    </div>
  );
}

const Dashboard = () => {
  const [ordersCache, setOrdersCache] = useState([]); // Cache for orders

  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const pathParts = pathname.split("/");
  const sectionFromUrl = searchParams.get("section") || "dashboard";

  const [activeSection, setActiveSection] = useState(sectionFromUrl);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderChatMode, setOrderChatMode] = useState(false);

  const user = session?.user || {
    name: "User Name",
    email: "user@example.com",
    image: "/placeholder.jpeg",
  };

  // Sync state when section changes
  useEffect(() => {
    setActiveSection(sectionFromUrl);
  }, [sectionFromUrl]);

  // Sync chat order from URL
  useEffect(() => {
    const chatOrderId = searchParams.get("chatOrderId");
    if (activeSection === "orders" && chatOrderId) {
      // If already set, do nothing
      if (selectedOrder && selectedOrder._id === chatOrderId && orderChatMode) return;
      // Try to find in cache first
      let order = ordersCache.find(o => o._id === chatOrderId);
      if (order) {
        setSelectedOrder(order);
        setOrderChatMode(true);
      } else {
        // Fallback: fetch from API
        fetch(`/api/bookingDetails/${chatOrderId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.order) {
              setSelectedOrder(data.order);
              setOrderChatMode(true);
            }
          });
      }
    }
  }, [activeSection, searchParams, selectedOrder, orderChatMode, ordersCache]);

  // Cache orders from AllOrders
  const handleOrdersFetched = (orders) => {
    setOrdersCache(orders || []);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOrderChatMode(false);
    setShowOrderDetail(false);
    setActiveSection("orders");
    router.push("/dashboard?section=orders");
  };

  const handleChatOrder = (order) => {
    setSelectedOrder(order);
    setOrderChatMode(true);
    setActiveSection("orders");
    // Add chatOrderId to URL for persistence
    router.push(`/dashboard?section=orders&chatOrderId=${order._id}`);
  };
  const handleBackToOrders = () => {
    setOrderChatMode(false); // or whatever logic returns to the orders list
    setSelectedOrder(null);  // optionally clear the selected order
  };
  

  const handleBackHome = () => {
    setShowOrderDetail(false);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("orderId");
    router.replace(`/dashboard${params.size ? "?" + params.toString() : ""}`);
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen px-15 bg-[#fcf7f1]">
      {/* Sidebar */}
      <aside className="w-[300px] bg-white rounded-2xl shadow-lg m-6 flex-shrink-0">
        <div className="flex flex-col items-center py-8 border-b">
          <div className="w-24 h-24 mb-2 rounded-full border-4 border-white shadow-lg overflow-hidden">
            <Image src={user.image} alt="avatar" width={96} height={96} className="object-cover w-full h-full" />
          </div>
          <div className="font-bold text-lg mt-2">{user.name}</div>
          <div className="text-red-500 text-sm">{user.email}</div>
        </div>

        <nav className="mt-2 items-center justify-center">
          <div className="px-6 py-2 text-base text-gray-500 bg-red-100 font-semibold">DASHBOARD</div>
          {sections.map(({ key, label }) => (
            <button
              key={key}
              className={`w-full text-left px-6 py-2 hover:bg-gray-50 rounded transition ${activeSection === key ? "font-bold text-black bg-gray-100" : "text-gray-800"
                }`}
              onClick={() => {
                setShowOrderDetail(false);
                router.push(`/dashboard?section=${key}`);
              }}
            >
              {label}
            </button>
          ))}

          <div className="px-6 py-2 mt-4 text-base text-gray-500 bg-red-100 font-semibold">ACCOUNT SETTINGS</div>
          {settings.map(({ key, label }) => (
            <button
              key={key}
              className={`w-full text-left px-6 py-2 hover:bg-gray-50 rounded transition ${activeSection === key ? "font-bold text-black" : "text-gray-800"
                }`}
              onClick={() => {
                setShowOrderDetail(false);
                router.push(`/dashboard?section=${key}`);
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#fdf6ee] rounded-2xl shadow-lg m-6 p-8">
        <SectionContent
          section={activeSection}
          orderId={orderId}
          onViewOrder={handleViewOrder}
          onBackHome={handleBackHome}
          showOrderDetail={showOrderDetail}
          selectedOrder={selectedOrder}
          orderChatMode={orderChatMode}
          onChatOrder={handleChatOrder}
          onOrdersFetched={handleOrdersFetched}
          onBack={handleBackToOrders}
        />
      </main>
    </div>
  );
};

export default Dashboard;
