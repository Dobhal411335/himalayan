import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import ProductReview from '@/models/ProductReview';
import Packages from "@/models/Packages";
import { deleteFileFromCloudinary } from "@/utils/cloudinary";

// POST: Add a new product review
export async function POST(req) {
  await connectDB();
  try {
    const { packageId, rating, title, review, createdBy, image } = await req.json();
    if (!packageId || !rating || !title || !review || !createdBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const reviewDoc = await ProductReview.create({
      packageId,
      rating,
      title,
      review,
      createdBy,
      image
    });
    // Push review _id to Product's reviews array
    await Packages.findByIdAndUpdate(packageId, { $push: { reviews: reviewDoc._id } });
    return NextResponse.json({ success: true, review: reviewDoc });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  await connectDB();
  try {
    const { reviewId, packageId, rating, title, review, image } = await req.json();
    if (!reviewId || !packageId) {
      return NextResponse.json({ error: 'Missing reviewId or packageId' }, { status: 400 });
    }

    // Get existing review
    const existingReview = await ProductReview.findById(reviewId);
    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Handle image update if new image is provided and different
    if (image && image.url && image.key) {
      // Delete old image if it exists and is different
      if (existingReview.image?.key && image.key !== existingReview.image.key) {
        await deleteFileFromCloudinary(existingReview.image.key);
      }
      // Update with new image
      await ProductReview.findByIdAndUpdate(reviewId, {
        image: {
          url: image.url,
          key: image.key
        }
      });
    } else if (image === null && existingReview.image?.key) {
      // Delete image if null is provided and there was an image before
      await deleteFileFromCloudinary(existingReview.image.key);
      await ProductReview.findByIdAndUpdate(reviewId, { image: null });
    }

    // Update other fields
    const updatedReview = await ProductReview.findByIdAndUpdate(
      reviewId,
      {
        rating,
        title,
        review,
        createdBy,
        updatedAt: new Date()
      },
      { new: true }
    );

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  try {
    const { reviewId, packageId } = await req.json();
    if (!reviewId || !packageId) {
      return NextResponse.json({ error: 'Missing reviewId or packageId' }, { status: 400 });
    }

    // Find the review
    const review = await ProductReview.findById(reviewId);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Delete the image from Cloudinary if it exists
    if (review.image?.key) {
      try {
        await deleteFileFromCloudinary(review.image.key);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
        // Continue with deletion even if image deletion fails
      }
    }

    // Remove review from Product's reviews array
    await Packages.findByIdAndUpdate(packageId, { $pull: { reviews: reviewId } });

    // Delete the review
    await ProductReview.findByIdAndDelete(reviewId);

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET: Get reviews for a product
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get('packageId');
    if (!packageId) {
      return NextResponse.json({ error: 'Missing packageId' }, { status: 400 });
    }
    // Only fetch approved reviews
    const reviews = await ProductReview.find({ packageId }).sort({ createdAt: -1 });
    return NextResponse.json({ reviews });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
