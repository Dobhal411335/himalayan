import OrderDetail from '../../../components/OrderDetail';

export default async function OrderDetailPage({ params }) {
  const { bookingId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/orders/${bookingId}`, {
    // You may need this to force server-side fetch in Next.js
    cache: "no-store"
  });
  if (!res.ok) return <div>Booking not found.</div>;
  const data = await res.json();
  const order = data.order;

  if (!order) return <div>Booking not found.</div>;

  return <OrderDetail order={order} />;
}