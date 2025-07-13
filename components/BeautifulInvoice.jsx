import React from "react";

/**
 * BeautifulInvoice - Modern invoice UI for booking confirmation and email.
 * Props: { booking, bookingId, bookingDate }
 */
export default function BeautifulInvoice({ booking, bookingId, bookingDate }) {
  // Helper for formatting
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
  };

  // Extract booking details
  const guest = booking || {};
  const hotel = {
    name: "Himalayan Wellness Retreat",
    address: "Rishikesh, Uttarakhand 249201, India",
    phone: "+91 9897515305",
    email: "himalayanwellnessretreats@gmail.com",
  };

  // Example: you may want to adjust these fields to match your backend
  const items = [
    {
      name: guest.roomName || guest.room?.title || "Room",
      desc: "Double bedroom with private bathroom",
      rate: `${guest.days || 1} Nights`,
      amount: booking?.priceBreakdown?.main?.amount || 0,
    },
    ...(booking?.priceBreakdown?.extraBed
      ? [
          {
            name: "Extra Bed",
            desc: "Extra bed for additional guest",
            rate: `Rs.${booking?.priceBreakdown?.extraBed?.amount}`,
            amount: booking?.priceBreakdown?.extraBed?.amount,
          },
        ]
      : []),
    ...(booking?.coupon
      ? [
          {
            name: "Promotional Code",
            desc: `${booking.coupon} - One Time Discount`,
            rate: "Discount",
            amount: -Math.abs(booking.couponAmount || 0),
          },
        ]
      : []),
  ];

  // Totals
  const subtotal = booking?.subtotal || items.reduce((sum, i) => sum + (i.amount || 0), 0);
  const tax = booking?.totalTaxAmount || 0;
  const taxPercent = booking?.totalTaxPercent || 0;
  const grandTotal = booking?.finalAmount || subtotal + tax;

  // Payment details (dummy for now)
  const payment = {
    method: "Credit Card",
    date: formatDate(bookingDate),
    txn: booking?.invoiceNumber || bookingId,
    amount: grandTotal,
  };

  return (
    <div style={{ fontFamily: 'Barlow, Arial, sans-serif', background: '#fff', color: '#222', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 24px #0001', maxWidth: 600, margin: '0 auto', border: '1px solid #e5e7eb' }}>
      {/* Header */}
      <div style={{ background: '#181a22', color: '#fff', padding: 24, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <img src="https://www.himalayanwellnessretreats.com/logo.png" alt="Logo" style={{ height: 40, marginBottom: 8 }} />
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>HIMALAYAN WELLNESS RETREAT</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>{hotel.phone} | {hotel.email}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 14 }}>
            <div><b>Invoice No:</b> <span style={{ color: '#3be0a9' }}>{invoiceNumber}</span></div>
            <div><b>Invoice Date:</b> {formatDate(bookingDate)}</div>
          </div>
        </div>
      </div>
      {/* Guest & Hotel Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 24px 0 24px', fontSize: 15 }}>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Guest Info:</div>
          <div style={{ fontWeight: 600 }}>{guest.firstName} {guest.lastName}</div>
          <div>Phone: {guest.callNo}</div>
          <div>Email: {guest.email}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Hotel Details:</div>
          <div style={{ fontWeight: 600 }}>{hotel.name}</div>
          <div>{hotel.address}</div>
        </div>
      </div>
      {/* Booking Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px 0 24px', fontSize: 14 }}>
        <div>
          <div><b>Booking ID:</b> {bookingId}</div>
          {/* <div><b>Room No:</b> {guest.roomNumber || 'N/A'}</div> */}
        </div>
        <div>
          <div><b>Check In:</b> {formatDate(guest.arrival)}</div>
          <div><b>Check Out:</b> {formatDate(guest.departure)}</div>
        </div>
        <div>
          <div><b>Nights:</b> {guest.days || 1}</div>
          {/* <div><b>Room Type:</b> {guest.roomType || 'Deluxe'}</div> */}
        </div>
      </div>
      {/* Items Table */}
      <div style={{ padding: '16px 24px 0 24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f7f7f7', color: '#222' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>Items</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Description</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Rate</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ borderTop: '1px solid #ececec' }}>
                <td style={{ padding: 8 }}>{item.name}</td>
                <td style={{ padding: 8 }}>{item.desc}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{item.rate}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{item.amount < 0 ? '-' : ''}₹{Math.abs(item.amount).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Totals - always at bottom right */}
      <div style={{ textAlign: 'right', padding: '8px 24px 0 24px', fontSize: 15 }}>
        <div>Sub Total: <span style={{ fontWeight: 500 }}>₹{subtotal.toLocaleString()}</span></div>
        <div>Tax ({taxPercent}%): <span style={{ fontWeight: 500 }}>₹{tax.toLocaleString()}</span></div>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#1bbd7e', marginTop: 8 }}>
          Grand Total: ₹{grandTotal.toLocaleString()}
        </div>
      </div>
      {/* Additional Info */}
      <div style={{ padding: '16px 24px 0 24px', fontSize: 13, color: '#666' }}>
        <div><b>Additional Information:</b></div>
        <div>{guest.specialReq || 'No special requirements.'}</div>
      </div>
      {/* Note */}
      <div style={{ background: '#181a22', color: '#fff', fontSize: 13, padding: 12, textAlign: 'center', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
        <span style={{ color: '#00e3a9', fontWeight: 600 }}>Note:</span> This is a computer generated receipt and does not require physical signature.
      </div>
    </div>
  );
}
