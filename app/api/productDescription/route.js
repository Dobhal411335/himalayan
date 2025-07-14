import { NextResponse } from 'next/server';
import connectDB from "@/lib/connectDB";
import Description from '@/models/Description';
import Packages from '@/models/Packages';

// POST: Add or update overview for a product
export async function POST(req) {
  await connectDB();
  try {
    const { packageId, overview } = await req.json();
    if (!packageId || !overview) {
      return NextResponse.json({ error: 'Missing packageId or overview' }, { status: 400 });
    }
    let descDoc = await Description.findOne({ packageId });
    if (descDoc) {
      descDoc.overview = overview;
      await descDoc.save();
    } else {
      descDoc = await Description.create({ packageId, overview });
    }
    // Link Description to Product
    await Packages.findByIdAndUpdate(packageId, { description: descDoc._id });
    return NextResponse.json({ success: true, description: descDoc });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET: Get description for a product or all products
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get('product') || searchParams.get('packageId');
    if (packageId) {
      const descDoc = await Description.findOne({ packageId }).populate('packageId', 'title');
      return NextResponse.json({ description: descDoc });
    } else {
      // Return all product descriptions with product name
      const descDocs = await Description.find({}).populate('packageId', 'title');
      return NextResponse.json({ descriptions: descDocs });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Update overview
export async function PATCH(req) {
  await connectDB();
  try {
    const { packageId, overview } = await req.json();
    if (!packageId || !overview) {
      return NextResponse.json({ error: 'Missing packageId or overview' }, { status: 400 });
    }
    const descDoc = await Description.findOneAndUpdate(
      { packageId },
      { overview },
      { new: true }
    );
    // Ensure Product.description is set
    if (descDoc) {
      await Packages.findByIdAndUpdate(packageId, { description: descDoc._id });
    }
    return NextResponse.json({ description: descDoc });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove description by packageId
export async function DELETE(req) {
  await connectDB();
  try {
    const { packageId } = await req.json();
    if (!packageId) {
      return NextResponse.json({ error: 'Missing packageId' }, { status: 400 });
    }
    await Description.findOneAndDelete({ packageId });
    await Packages.findByIdAndUpdate(packageId, { $unset: { description: "" } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
