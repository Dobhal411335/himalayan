import { NextResponse } from 'next/server';
import connectDB from "@/lib/connectDB";
import BookingDetails from '@/models/BookingDetails';

// Ensure mongoose connection (adjust as needed for your setup)

export async function GET(req) {
  await connectDB();
  try {
    let type = 'room';
    if (req?.url) {
      const { searchParams } = new URL(req.url);
      if (searchParams.get('type')) type = searchParams.get('type');
    }
    const bookings = await BookingDetails.find({ type }).sort({ createdAt: -1 });
    return NextResponse.json({ bookings, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
    connectDB();
  try {
    const body = await req.json();
    if (body.type === 'room') {
      const booking = new BookingDetails({ ...body });
      await booking.save();
      return NextResponse.json({ success: true, booking });
    } else {
      // Handle other types if needed
      return NextResponse.json({ success: false, error: 'Unsupported booking type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
