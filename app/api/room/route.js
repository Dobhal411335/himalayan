// API Route for ProductProfile (Create Product)
import connectDB from "@/lib/connectDB";
import Room from "@/models/Room"
import RoomAmenities from '@/models/RoomAmenities';
import RoomPrice from '@/models/RoomPrice';
import RoomReview from '@/models/RoomReview';
import { deleteFileFromCloudinary } from '@/utils/cloudinary';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    // Accept all relevant fields
    const { title, code, isDirect, categoryTag, ...rest } = body;
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
        return new Response(JSON.stringify({ error: 'categoryTag required for category products' }), { status: 400 });
      }
      productData.isDirect = false;
      productData.categoryTag = categoryTag;
    }
    // Create product with proper linkage
    const room = await Room.create(productData);
    // Add product ref to artisan
    return new Response(JSON.stringify(room), { status: 201 });
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
      const product = await Room.findById(id)
        .populate('artisan')
        .populate('size')
        // .populate('color')
        .populate('price')
        .populate('gallery')
        .populate('video')
        .populate('description')
        .populate('info')
        .populate('categoryTag')
        .populate('productTagLine')
        .populate('reviews')
        .populate('quantity')
        .populate('coupons')
        .populate('taxes');
      if (!product || !product.active) {
        return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
      }
      // Ensure taxes is populated
      if (product.taxes && typeof product.taxes === 'object' && product.taxes._id) {
        // Already populated
      } else if (product.taxes) {
        const TaxModel = (await import('@/models/ProductTax')).default;
        const taxDoc = await TaxModel.findById(product.taxes);
        product.taxes = taxDoc;
      }
      return new Response(JSON.stringify(product), { status: 200 });
    } else if (name) {
      // Fallback to slug search
      const product = await Room.findOne({ slug: name })
        .populate('artisan')
        .populate('size')
        // .populate('color')
        .populate('price')
        .populate('gallery')
        .populate('video')
        .populate('description')
        .populate('info')
        .populate('categoryTag')
        .populate('productTagLine')
        .populate('reviews')
        .populate('quantity')
        .populate('coupons')
        .populate('taxes');

      if (!product) {
        return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
      }
      // Ensure taxes is populated
      if (product.taxes && typeof product.taxes === 'object' && product.taxes._id) {
        // Already populated
      } else if (product.taxes) {
        const TaxModel = (await import('@/models/ProductTax')).default;
        const taxDoc = await TaxModel.findById(product.taxes);
        product.taxes = taxDoc;
      }
      return new Response(JSON.stringify(product), { status: 200 });
    } else {
      // Filter by isDirect if requested
      let filter = {};
      if (isDirectParam === 'true') filter.isDirect = true;
      if (isDirectParam === 'false') filter.isDirect = false;
      // Always filter for active products
      filter.active = true;
      let products = await Room.find(filter)
        .populate('artisan')
        // .populate('size')
        // .populate('color')
        .populate('price')
        .populate('gallery')
        .populate('video')
        .populate('description')
        .populate('info')
        .populate('categoryTag')
        .populate('productTagLine')
        .populate('reviews')
        .populate('quantity')
        .populate('coupons')
        .populate('taxes');

      // Ensure taxes is populated for all products
      const TaxModel = (await import('@/models/ProductTax')).default;
      products = await Promise.all(products.map(async (product) => {
        if (product.taxes && typeof product.taxes === 'object' && product.taxes._id) {
          return product;
        } else if (product.taxes) {
          const taxDoc = await TaxModel.findById(product.taxes);
          product = product.toObject();
          product.taxes = taxDoc;
          return product;
        }
        return product;
      }));

      return new Response(JSON.stringify(products), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
