import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";
import MenuBar from "@/models/MenuBar";
import mongoose from "mongoose";
import Room from "@/models/Room"
function slugify(str) {
    if (!str) return '';
    return str
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');
}

export async function POST(req) {
    await connectDB();
    const body = await req.json();
    const slug = slugify(body.title);

    try {
        // Step 1: Check for existing room
        let roomQuery = {
            title: body.title,
            code: body.code,
            slug: slug
        };
        // Optionally, also check for subMenu/category if you want to scope uniqueness
        let existingRoom = await Room.findOne(roomQuery);
        if (existingRoom) {
            // If already linked to submenu, skip push
            if (!body.isDirect && body.subMenuId) {
                const menuBarDoc = await MenuBar.findOne({ "subMenu._id": body.subMenuId });
                const updateResult = await MenuBar.updateOne(
                    { "subMenu._id": body.subMenuId, "subMenu.rooms": { $ne: existingRoom._id } },
                    { $push: { "subMenu.$.rooms": existingRoom._id } }
                );
                if (updateResult.matchedCount === 0) {
                    console.error("No submenu matched for existing room linkage!", body.subMenuId);
                }
            }
            return NextResponse.json({ message: "Room already exists!", room: existingRoom }, { status: 200 });
        }
        // Step 2: Create a new Room document
        const newRoom = await Room.create({
            title: body.title,
            code: body.code,
            slug: slug,
            paragraph: body.paragraph,
            mainPhoto: body.mainPhoto,
            relatedPhotos: body.relatedPhotos,
            prices: body.prices,
            amenities: body.amenities,
            reviews: body.reviews,
            isDirect: body.isDirect,
            ...(body.subMenuId ? { category: body.subMenuId } : {})
        });

        // Step 3: Link new room to submenu
        if (!body.isDirect && body.subMenuId) {
            const menuBarDoc = await MenuBar.findOne({ "subMenu._id": body.subMenuId });
            const updateResult = await MenuBar.updateOne(
                { "subMenu._id": body.subMenuId, "subMenu.rooms": { $ne: newRoom._id } },
                { $push: { "subMenu.$.rooms": newRoom._id } }
            );
            if (updateResult.matchedCount === 0) {
                console.error("No submenu matched for new rooms linkage!", body.subMenuId);
            }
        }
        return NextResponse.json({ message: "Room added successfully!", room: newRoom }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
export async function PUT(req) {
    await connectDB();
    try {
        const body = await req.json();
        // Support either code or _id as identifier
        const identifier = body._id ? { _id: body._id } : { code: body.code };
        if (!identifier._id && !identifier.code) {
            return NextResponse.json({ message: 'Room identifier (code or _id) required' }, { status: 400 });
        }
        // Find the room
        const existingRoom = await Room.findOne(identifier);
        if (!existingRoom) {
            return NextResponse.json({ message: 'Room not found' }, { status: 404 });
        }
        // Prepare update fields (do not allow code overwrite)
        const updateFields = { ...body };
        delete updateFields._id;
        delete updateFields.code;
        // Update room
        const updatedRoom = await Room.findOneAndUpdate(identifier, updateFields, { new: true });
        return NextResponse.json({ message: 'Room updated successfully!', room: updatedRoom });
    } catch (error) {
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
export async function PATCH(req) {
    await connectDB();
    const body = await req.json();
    const { roomId, ...updateFields } = body;

    try {
        // Update the room
        const updatedRoom = await Room.findByIdAndUpdate(roomId, updateFields, { new: true });
        if (!updatedRoom) {
            return NextResponse.json({ message: "Room not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Room updated successfully!", room: updatedRoom });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
export async function DELETE(req) {
    await connectDB();
    const { id } = await req.json();

    try {
        // Find the room to delete
        const roomToDelete = await Room.findById(id);
        if (!roomToDelete) {
            return NextResponse.json({ message: "Room not found!" }, { status: 404 });
        }
        // Delete the room from the database
        const deletedRoom = await Room.findByIdAndDelete(id);

        // Remove room references from MenuBar
        await MenuBar.updateMany(
            { "subMenu.rooms": id },
            { $pull: { "subMenu.$[].rooms": id } }
        );

        return NextResponse.json({ message: "Room deleted successfully!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
