import connectDB from "@/lib/connectDB";
import Quantity from '@/models/Quantity';
import Packages from '@/models/Packages';
import mongoose from 'mongoose';
// GET: List all packages quantity records or by packagesId
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    // Accept both 'packages' and 'packagesId' for compatibility
    const packagesId = searchParams.get('packages') || searchParams.get('packagesId');
    let result;
    if (packagesId) {
      result = await Quantity.findOne({ packages: packagesId });
      return Response.json(result || {});
    } else {
      const quantities = await Quantity.find({});
      return Response.json(quantities);
    }
  } catch (err) {
    return Response.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

// POST: Upsert (create or update) packages quantity by packagesId
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log('POST /api/productQuantity payload:', body);
    if (typeof body.prices === 'string') {
      try {
        body.prices = JSON.parse(body.prices);
      } catch (e) {
        return Response.json({ error: 'Invalid prices format' }, { status: 400 });
      }
    }
    if (!body.packages || !Array.isArray(body.prices)) {
      return Response.json({ error: 'Missing packages or prices' }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(body.packages)) {
      return Response.json({ error: 'Invalid packages ObjectId' }, { status: 400 });
    }

    // Validate prices
    for (const p of body.prices) {
      if (!p.person || !p.type || (typeof p.inr !== 'number' && typeof p.usd !== 'number')) {
        return Response.json({ error: 'Each price must have person, type, inr or usd' }, { status: 400 });
      }
    }
    // Upsert by packages
    const updated = await Quantity.findOneAndUpdate(
      { packages: body.packages },
      {
        $set: { prices: body.prices },
        $setOnInsert: { packages: body.packages }
      },
      { new: true, upsert: true }
    );
    // Also update Packages document: only set the quantity field to the Quantity _id
    await Packages.findByIdAndUpdate(body.packages, { quantity: updated._id });
    return Response.json(updated, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update a packages quality record by id
export async function PUT(req) {
  try {
    await connectDB();
    const { _id, ...rest } = await req.json();
    const updated = await Quantity.findByIdAndUpdate(_id, rest, { new: true });
    if (!updated) return Response.json({ error: 'Not found' }, { status: 404 });
    // Also update Packages document: only set the quantity field to the Quantity _id
    if (rest.packages) {
      const quantity = await Quantity.findOneAndUpdate(
        { packages: rest.packages },
        { quantity: updated._id },
        { new: true }
      );
      return Response.json({ quantity });
    }
    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Remove a packages quality record by id (expects ?id=...)
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const packagesId = searchParams.get('packagesId');
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
    await Quantity.findByIdAndDelete(id);
    await Packages.findByIdAndUpdate(packagesId, { quantity: null });
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
