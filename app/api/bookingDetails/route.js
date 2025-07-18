import { NextResponse } from 'next/server';
import connectDB from "@/lib/connectDB";
import BookingDetails from '@/models/BookingDetails';
import User from '@/models/User';
import { getServerSession } from "next-auth/next";

// Ensure mongoose connection (adjust as needed for your setup)

export async function GET(req) {
  await connectDB();
  const session = await getServerSession();
  console.log('SESSION:', session);
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    let type = 'room';
    if (req?.url) {
      const { searchParams } = new URL(req.url);
      if (searchParams.get('type')) type = searchParams.get('type');
    }
    // Only fetch bookings for the logged-in user
    // Prefer userId if available, fallback to email for backward compatibility
    const userFilter = session.user.id
      ? { userId: session.user.id }
      : { email: session.user.email };
    console.log('USER FILTER:', userFilter);
    const bookings = await BookingDetails.find({
      type,
      ...userFilter
    }).sort({ createdAt: -1 });
    console.log('BOOKINGS FOUND:', bookings.length);
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
