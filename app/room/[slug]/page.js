// app/room/[slug]/page.js
import RoomComponent from "@/components/RoomComponent"; // or your actual component

export default async function RoomPage({ params }) {
    const { slug } = params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/room/${encodeURIComponent(slug)}`);
    const room = await res.json();
    if (!room || room.error) return <div>Room Not Found</div>;
    return <RoomComponent data={room} />;
}