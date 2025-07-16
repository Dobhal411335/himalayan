// API Route for ProductProfile (Create Product)
import connectDB from "@/lib/connectDB";
import Packages from '@/models/Packages';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    // Accept all relevant fields
    const { title, code, isDirect, ...rest } = body;
    if (!title || !code) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    // If explicitly direct, ignore categoryTag
    let productData = {
      title,
      code,
      isDirect: true,
      ...rest
    };
    // If not direct, require categoryTag
    if (!isDirect) {
      if (!categoryTag) {
        return new Response(JSON.stringify({ error: 'categoryTag required for category Package' }), { status: 400 });
      }
      productData.isDirect = false;
      productData.categoryTag = categoryTag;
    }
    // Create product with proper linkage
    const packages = await Packages.create(productData);
    
    return new Response(JSON.stringify(packages), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    // Support direct products filter for ProductProfile page
    const isDirectParam = searchParams.get('isDirect');
    if (id) {
      // Find by MongoDB _id
      const packages = await Packages.findById(id)
        .populate('price')
        .populate('gallery')
        .populate('video')
        .populate('description')
        .populate('info')
        .populate('reviews')
        .populate('packagePrice')
      if (!packages || !packages.active) {
        return new Response(JSON.stringify({ error: 'packages not found' }), { status: 404 });
      }
      return new Response(JSON.stringify(packages), { status: 200 });
    
    } else {
      // Filter by isDirect if requested
      let filter = {};
      if (isDirectParam === 'true') filter.isDirect = true;
      if (isDirectParam === 'false') filter.isDirect = false;
      // Always filter for active products
      filter.active = true;
      let packages = await Packages.find(filter)
        .populate('price')
        .populate('gallery')
        .populate('video')
        .populate('description')
        .populate('info')
        .populate('reviews')
        .populate('packagePrice')
      return new Response(JSON.stringify(packages), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}