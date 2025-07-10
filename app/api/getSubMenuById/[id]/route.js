import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";
import MenuBar from "@/models/MenuBar";
import Room from "@/models/Room";

export async function GET(req, { params }) {
    await connectDB();
    const { id } = await params;
    // console.log(id)

    try {

        const menu = await MenuBar.findOne({ "subMenu._id": id })
            .populate({ path: "subMenu.rooms", strictPopulate: false })
            .lean();

        if (!menu) {
            return NextResponse.json({ message: "SubMenu not found" }, { status: 404 });
        }

        
        const subMenu = menu.subMenu.find((sub) => sub._id.toString() === id);

        if (!subMenu) {
            return NextResponse.json({ message: "SubMenu not found inside menu" }, { status: 404 });
        }

        // Manually populate rooms array
        const mongoose = (await import('mongoose')).default;
        const Room = mongoose.model('Room');
        const roomDocs = await Room.find({ _id: { $in: subMenu.rooms || [] } });
        const populatedSubMenu = { ...subMenu, rooms: roomDocs };

        return NextResponse.json(populatedSubMenu);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
