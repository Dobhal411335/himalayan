const mongoose = require('mongoose');

const BookingDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  bookingId: { type: String, required: true },
  arrival: { type: Date, required: true },
  departure: { type: Date, required: true },
  days: { type: Number, required: true },
  specialReq: { type: String },
  offers: [{ type: String }],
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  callNo: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  adult: { type: Number, required: true },
  child: { type: Number },
  price: { type: Number },
  // Room summary details
  roomName: { type: String },
  priceBreakdown: {
    main: {
      type: { type: String },
      amount: { type: Number },
      cgst: { type: Number },
      sgst: { type: Number },
      oldPrice: { type: Number },
    },
    extraBed: {
      type: { type: String },
      amount: { type: Number },
      cgst: { type: Number },
      sgst: { type: Number },
      oldPrice: { type: Number },
    },
  },
  subtotal: { type: Number },
  totalCgst: { type: Number },
  totalSgst: { type: Number },
  totalTaxPercent: { type: Number },
  totalTaxAmount: { type: Number },
  finalAmount: { type: Number },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  type: { type: String, default: 'room' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.BookingDetails || mongoose.model('BookingDetails', BookingDetailsSchema);
