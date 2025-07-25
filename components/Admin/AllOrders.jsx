"use client";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Search,
  Bell,
  UserCircle,
  Edit,
  Trash2,
  Eye,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  Store,
  X
} from "lucide-react";



function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}



const AllOrders = () => {

  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [viewOrder, setViewOrder] = useState(null); // For modal
  const rowsPerPage = 8;
  // console.log(orders)
  // Filtering logic
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = search ? (
      (order.bookingId && order.bookingId.toLowerCase().includes(search.toLowerCase())) ||
      (order.firstName && order.firstName.toLowerCase().includes(search.toLowerCase()))
    ) : true;
    // Date filter
    const matchesDate = dateFilter ? (() => {
      if (!order.departure) return false;
      const orderDate = new Date(order.departure);
      // Format to yyyy-mm-dd
      const orderDateStr = orderDate.toISOString().slice(0, 10);
      return orderDateStr === dateFilter;
    })() : true;
    return matchesSearch && matchesDate;
  });
  const paginatedOrders = filteredOrders.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  useEffect(() => {
    async function fetchOrders() {
      try {
        let res = await fetch("/api/bookingDetails/admin?type=packages");
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          setOrders(data.bookings);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setOrders([]);
      }
    }
    fetchOrders();
  }, []);
  // Helper for date formatting
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB');
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search orders, customers, products..."
                className="w-full pl-10 pr-4 py-2 rounded bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            </div>
          </div>
            <div className="flex gap-2 items-center">
              <label className="font-medium text-gray-600">Date:</label>
              <input
                type="date"
                className="px-3 py-2 border rounded bg-gray-100 focus:outline-none"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
              />
            </div>
        </header>

        {/* Table */}
        <div className="flex-1 overflow-x-auto p-4">
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden text-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">S.No</th>
                <th className="p-3 text-left">Order No</th>
                <th className="p-3 text-left">Customer Name</th>
                <th className="p-3 text-left">Arrival Date</th>
                <th className="p-3 text-center">View</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-gray-400">No orders found.</td>
                </tr>
              )}
              {paginatedOrders.map((order, idx) => (
                <tr key={order._id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 font-mono text-blue-700">{idx + 1}</td>
                  <td className="p-3 ">{order.bookingId}</td>
                  <td className="p-3">{`${order.firstName || ''} ${order.lastName || ''}`.trim() || order.email || order.phone}</td>
                  <td className="p-3">{formatDate(order.arrival)}</td>
                  <td className="p-3 text-center">
                    <button className="p-2 rounded hover:bg-blue-100" title="View" onClick={() => setViewOrder(order)}><Eye className="text-blue-600" size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center px-4 pb-4">
          <span className="text-md text-gray-600">
            Showing {(page - 1) * rowsPerPage + 1} - {Math.min(page * rowsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
          </span>
          <div className="flex gap-1">
            <button
              className="px-3 py-1 rounded border bg-white disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={classNames(
                  "px-3 py-1 rounded border",
                  page === i + 1 ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-white"
                )}
                onClick={() => setPage(i + 1)}
              >{i + 1}</button>
            ))}
            <button
              className="px-3 py-1 rounded border bg-white disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >Next</button>
          </div>
        </div>
      </div>

      {/* Modal for viewing order details */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh] animate-fade-in">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setViewOrder(null)}
              title="Close"
            >
              <X className="text-blue-600" size={18} />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold mb-1 text-[#7a5b2b] text-center">Package Booking Details</h2>
            <p className="text-sm text-center text-gray-600 mb-5">Booking overview and invoice breakdown</p>

            {/* Booking Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-md mb-4">
              <div><span className="font-bold text-black">Booking ID:</span> <span className="font-mono">{viewOrder.bookingId}</span></div>
              <div><span className="font-bold text-black">Status:</span> <span className={`capitalize font-semibold ${viewOrder.status === 'confirmed' ? 'text-green-600' : 'text-blue-700'}`}>{viewOrder.status}</span></div>
              <div><span className="font-bold text-black">Name:</span> {viewOrder.firstName} {viewOrder.lastName}</div>
              <div><span className="font-bold text-black">Email:</span> {viewOrder.email}</div>
              <div><span className="font-bold text-black">Phone:</span> {viewOrder.callNo}</div>
              <div><span className="font-bold text-black">Alt Call No:</span> {viewOrder?.altCallNo}</div>
              <div><span className="font-bold text-black">Address:</span> <span className="text-gray-700">{viewOrder.address}</span></div>
            </div>

            {/* Room Info */}
            <div className="border-t border-b py-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-md">
                <div><span className="font-bold text-black">Package Name:</span> {viewOrder.packageName}</div>
                <div><span className="font-bold text-black">Uploaded ID:</span> 
                  {viewOrder.packageIdImage?.url ? (
                    <img src={viewOrder.packageIdImage?.url} alt="ID Document" className="w-24 h-24 object-cover" />
                  ) : 'Not uploaded'}
                </div>
                <div><span className="font-bold text-black">Arrival:</span> {formatDate(viewOrder.arrival)}</div>
                <div><span className="font-bold text-black">Persons:</span> {viewOrder.adult} Adult{viewOrder.child ? `, ${viewOrder.child} Child` : ''}{viewOrder.infant ? `, ${viewOrder.infant} Infant` : ''}</div>
              </div>
            </div>

            {/* Extra Info */}
            <div className="text-md mb-4 space-y-1">
              <div><span className="font-bold text-black">Offers:</span> {Array.isArray(viewOrder.offers) && viewOrder.offers.length > 0 ? viewOrder.offers.join(', ') : 'None'}</div>
              <div><span className="font-bold text-black">Special Requests:</span> {viewOrder.specialReq || 'None'}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AllOrders;