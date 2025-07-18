import { NextResponse } from 'next/server';
import connectDB from "@/lib/connectDB";
import BookingDetails from '@/models/BookingDetails';
import User from '@/models/User';
import { getServerSession } from "next-auth/next";

// Ensure mongoose connection (adjust as needed for your setup)

export async function GET(req) {
  await connectDB();
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const userIdFromQuery = searchParams.get('userId');
  // console.log('SESSION:', session);
  if (!userIdFromQuery && (!session || !session.user || (!session.user.email && !session.user.id))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    let type = 'room';
    if (req?.url) {
      if (searchParams.get('type')) type = searchParams.get('type');
    }
    // Prefer userId from query, fallback to session
    let userFilter = {};
    if (userIdFromQuery) {
      userFilter.userId = userIdFromQuery;
    } else if (session?.user?.id) {
      userFilter.userId = session.user.id;
    } else if (session?.user?.email) {
      userFilter.email = session.user.email;
    }
    // console.log('USER FILTER:', userFilter);
    const bookings = await BookingDetails.find({
      type,
      ...userFilter
    }).sort({ createdAt: -1 });
    // console.log('BOOKINGS FOUND:', bookings.length);
    return NextResponse.json({ bookings, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    if (body.type === 'room' || body.type === 'packages') {
      const booking = new BookingDetails({ ...body });
      await booking.save();
      // Also add booking._id to the user's bookings array
      if (booking.userId) {
        await User.findByIdAndUpdate(
          booking.userId,
          { $push: { bookings: booking._id } }
        );
      }
      return NextResponse.json({ success: true, booking });
    } else {
      return NextResponse.json({ success: false, error: 'Unsupported booking type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
