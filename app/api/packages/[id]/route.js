// API Route for fetching, updating, and deleting a product by ID
import connectDB from "@/lib/connectDB";
import Packages from '@/models/Packages';
import Artisan from '@/models/Artisan';
import Price from '@/models/Price';
import Gallery from '@/models/Gallery';
import Video from '@/models/Video';
import Description from '@/models/Description';
import Info from '@/models/Info';
import Size from '@/models/Size';
import CategoryTag from '@/models/CategoryTag';
import ProductReview from '@/models/ProductReview';
import ProductTax from '@/models/ProductTax';
import ProductCoupons from '@/models/ProductCoupons';
import Quantity from '@/models/Quantity';
import Color from '@/models/Color';
import ProductTagLine from '@/models/ProductTagLine';
import ArtisanStory from '@/models/ArtisanStory';
// import Tax from '@/models/ProductTax';

import { deleteFileFromCloudinary } from '@/utils/cloudinary';
export async function GET(req, { params }) {
  // console.log(params.id)
  try {
    await connectDB();
    // let { id } = params;
    // try { id = decodeURIComponent(id); } catch (e) { }
    // console.log("Product API called with id:", id);
    // if (!id || id.length !== 24) {
    //   console.error("Invalid product id:", id);
    //   return new Response(JSON.stringify({ error: 'Invalid product id' }), { status: 400 });
    // }
    const id = decodeURIComponent(params.id);

    // Strictly fetch by MongoDB _id
    let product = await Packages.findById(id)
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
    .populate('taxes')
    .populate({
      path: 'artisan',
      populate: { path: 'artisanStories' }
    })
    if (!product || !product.active) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }
    // If taxes is still an ID, force populate
    if (product.taxes && typeof product.taxes === 'object' && product.taxes._id) {
      // Already populated
    } else if (product.taxes) {
      const TaxModel = (await import('@/models/ProductTax')).default;
      const taxDoc = await TaxModel.findById(product.taxes);
      product = product.toObject();
      product.taxes = taxDoc;
    }
    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    // Find the product to get the artisan reference before deleting
    const product = await Packages.findById(id).populate('artisan');
    if (!product || !product.active) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }
    // Remove the product reference from the artisan's products array
    if (product.artisan) {
      await Artisan.findByIdAndUpdate(
        product.artisan,
        { $pull: { products: product._id } }
      );
    }
    // Delete all color and size docs for this product
    await Color.deleteMany({ product: id });
    await Size.deleteMany({ product: id });

    // Cascade delete subcomponents and images
    // (All models and utilities are already imported at the top)

    // Delete gallery and its images
    if (product.gallery) {
      const galleryDoc = await Gallery.findById(product.gallery);
      if (galleryDoc) {
        if (galleryDoc.mainImage?.key) {
          try { await deleteFileFromCloudinary(galleryDoc.mainImage.key); } catch (e) { console.error('Cloudinary deletion failed:', e.message); }
        }
        if (Array.isArray(galleryDoc.subImages)) {
          for (const subImg of galleryDoc.subImages) {
            if (subImg?.key) {
              try { await deleteFileFromCloudinary(subImg.key); } catch (e) { console.error('Cloudinary deletion failed:', e.message); }
            }
          }
        }
        await Gallery.findByIdAndDelete(product.gallery);
      }
    }
    // Delete video
    if (product.video) {
      await Video.findByIdAndDelete(product.video);
    }
    // Delete description
    if (product.description) {
      await Description.findByIdAndDelete(product.description);
    }
    // Delete info
    if (product.info) {
      await Info.findByIdAndDelete(product.info);
    }
    // Delete categoryTag
    if (product.categoryTag) {
      await CategoryTag.findByIdAndDelete(product.categoryTag);
    }
    // Delete proudct tag line
    if (product.productTagLine) {
      await CategoryTag.findByIdAndDelete(product.productTagLine);
    }

    // Delete reviews
    if (Array.isArray(product.reviews)) {
      for (const reviewId of product.reviews) {
        await ProductReview.findByIdAndDelete(reviewId);
      }
    }
    // Delete quantity
    if (product.quantity) {
      await Quantity.findByIdAndDelete(product.quantity);
    }
    // Delete coupons
    if (product.coupons) {
      await ProductCoupons.findByIdAndDelete(product.coupons);
    }
    // Delete taxes
    if (product.taxes) {
      await ProductTax.findByIdAndDelete(product.taxes);
    }
    // Now delete the product
    await Packages.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: 'Product and all related data deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// PATCH: Update any part of the product (sizes, colors, gallery, etc.)
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    // PATCH can update url, title, artisan, etc.
    const updated = await Packages.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}