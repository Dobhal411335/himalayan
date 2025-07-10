// API Route for fetching, updating, and deleting a product by ID
import connectDB from "@/lib/connectDB";
import Room from '@/models/Room';
import RoomAmenities from '@/models/RoomAmenities';
import RoomPrice from '@/models/RoomPrice';
import RoomReview from '@/models/RoomReview';

export async function GET(req, { params }) {
    const { id } = await params;
    if (!id) {
        return new Response(JSON.stringify({ error: "Room ID is required" }), { status: 400 });
    }
    try {
        const room = await Room.findById(id);
        if (!room) {
            return new Response(JSON.stringify({ error: "Room not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(room), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
