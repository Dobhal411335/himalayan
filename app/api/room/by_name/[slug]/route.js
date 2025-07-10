// app/api/room/[slug]/route.js
import Room from "@/models/Room"; // adjust as needed

export async function GET(req, { params }) {
    const { slug } = await params;
    const room = await Room.findOne({ slug });
    if (!room) {
        return new Response(JSON.stringify({ error: "Room not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(room), { status: 200 });
}