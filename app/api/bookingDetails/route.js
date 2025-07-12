import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import BookingDetails from '@/models/BookingDetails';

// Ensure mongoose connection (adjust as needed for your setup)
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

export async function POST(req) {
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
