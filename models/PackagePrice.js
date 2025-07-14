import mongoose from 'mongoose';

const PriceDetailSchema = new mongoose.Schema({
  type: { type: String, required: true },
  inr: { type: Number, required: true },
  usd: { type: Number, required: true },
});

const PackagePriceSchema = new mongoose.Schema({
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Packages', required: true, unique: true },
  onePerson: [PriceDetailSchema], // Array for 1 person
  twoPerson: [PriceDetailSchema], // Array for 2 persons
  eightPerson: [PriceDetailSchema], // Array for 8 persons (minimum up to 8)
}, { timestamps: true });

export default mongoose.models.PackagePrice || mongoose.model('PackagePrice', PackagePriceSchema);
