"use client"
import React, { useState } from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// --- Fetch orders from API, only those with agree === true ---
const PAGE_SIZE = 10; // You can keep pagination if needed


const statusStyles = {
    "IN PROGRESS": "bg-blue-500 text-white",
    CANCELED: "bg-red-500 text-white",
    DELIVERED: "bg-green-500 text-white",
    DELAYED: "bg-yellow-500 text-white",
};

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

/**
 * AllOrders component
 * @param {Object} props
 * @param {function} props.onViewOrder - Called with order object when 'View' is clicked. Optional.
 */
const AllOrders = ({ onViewOrder,userId, onChatOrder, onBack }) => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const router = useRouter();
    console.log(orders)
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/bookingDetails?userId=${encodeURIComponent(userId)}`);
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch orders');
                }
                
                if (data.success) {
                    // Transform the data to match the expected format
                    const formattedOrders = (data.bookings || []).map(booking => ({
                        ...booking,
                        // Ensure required fields have default values
                        bookingId: booking.bookingId || `B-${booking._id?.slice(-6) || 'N/A'}`,
                        status: booking.status || 'PENDING',
                        createdAt: booking.createdAt || new Date().toISOString(),
                        // Add any other transformations needed
                    }));
                    
                    setOrders(formattedOrders);
                } else {
                    setError(data.error || "No bookings found");
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.message || "Failed to fetch bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    const totalPages = Math.ceil(orders.length / PAGE_SIZE);
    const paginatedOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="py-8 text-center">Loading orders...</div>
                ) : error ? (
                    <div className="py-8 text-center text-red-500">{error}</div>
                ) : (
                    <>
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-3 px-2 font-semibold text-sm text-[#333]">ORDER #</th>
                                    <th className="py-3 px-2 font-semibold text-sm text-[#333]">DATE PURCHASED</th>
                                    <th className="py-3 px-2 font-semibold text-sm text-[#333]">VIEW</th>
                                    <th className="py-3 px-2 font-semibold text-sm text-[#333]">Enquiry Order</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedOrders.map((order, idx) => (
                                    <tr
                                        key={order._id}
                                        className={
                                            "border-b hover:bg-[#f8f4ef] transition " +
                                            (idx % 2 === 1 ? "bg-[#fcf7f1]" : "bg-white")
                                        }
                                    >
                                        <td className="py-3 px-2 font-mono text-[15px] text-[#222]">
                                            {order.bookingId || `B-${order._id?.slice(-6) || 'N/A'}`}
                                        </td>
                                        <td className="py-3 px-2 text-[15px] text-gray-700">
                                            {formatDate(order.createdAt || new Date())}
                                            <div className="text-xs text-gray-500">
                                                {order.type === 'packages' ? 'Package' : 'Room'}
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-sm">
                                            <button
                                                className="text-blue-600 hover:underline"
                                                onClick={() => onViewOrder ? onViewOrder(order) : null}
                                            >
                                                View
                                            </button>
                                        </td>
                                        <td className="py-3 px-2 text-sm">
                                            <button
                                                className="text-blue-600 hover:underline"
                                                onClick={() => onChatOrder ? onChatOrder(order, onBack) : null}
                                            >
                                                Chat
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-6">
                <button
                    className="border px-4 py-1.5 rounded-full text-[15px] disabled:opacity-50"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                    PREV
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`border px-4 py-1.5 rounded-full text-[15px] ${page === i + 1 ? "bg-black text-white" : "bg-white text-black"}`}
                        onClick={() => setPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className="border px-4 py-1.5 rounded-full text-[15px] disabled:opacity-50"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                    NEXT
                </button>
            </div>
        </div>
    );
};

export default AllOrders;