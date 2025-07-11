// Product.js - Mongoose Product Model for AddDirectProduct Page
import mongoose from 'mongoose';
const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true },
  slug: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuBar' }, // or ref: 'SubMenu' if you have such a model
  artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'Artisan' },
  isDirect: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  size: { type: mongoose.Schema.Types.ObjectId, ref: 'Size' },
  color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' },
  price: { type: mongoose.Schema.Types.ObjectId, ref: 'Price' },
  gallery: { type: mongoose.Schema.Types.ObjectId, ref: 'Gallery' },
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
  description: { type: mongoose.Schema.Types.ObjectId, ref: 'Description' },
  info: { type: mongoose.Schema.Types.ObjectId, ref: 'Info' },
  categoryTag: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryTag' },
  productTagLine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductTagLine',
  },
  taxes: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductTax' },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductReview' }],
  quantity: { type: mongoose.Schema.Types.ObjectId, ref: 'Quantity' },
  coupons: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCoupons' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Packages || mongoose.model('Packages', PackageSchema);
