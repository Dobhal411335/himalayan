import connectDB from "@/lib/connectDB";
import MenuBar from "@/models/MenuBar";
import { NextResponse } from "next/server";
import "@/models/Room"; // Needed for subMenu.rooms population
import "@/models/RoomAmenities";
import "@/models/RoomPrice";
import "@/models/RoomReview";
export async function GET(req) {
    await connectDB();
    const menu = await MenuBar.find({})
        .populate({
            path: 'subMenu.rooms',
            populate: [
                { path: 'reviews' },
                { path: 'prices' },
                { path: 'amenities' },
            ]
        })
        .sort({ order: 1 });
    return NextResponse.json(menu);
}