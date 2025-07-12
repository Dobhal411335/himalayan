"use client";
import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
const InvoiceModal = ({ open, onClose, booking, bookingId, bookingDate }) => {
  if (!open) return null;

  const invoiceRef = useRef(null);
  const exportRef = useRef(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Helper for date formatting
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB');
  };

  // Data extraction
  const roomName = booking?.roomName || booking?.room?.title || '';
  // Person breakdown
  const numAdult = booking?.adult || 0;
  const numChild = booking?.child || 0;
  const numInfant = booking?.infant || 0;
  const numPerson = [
    numAdult ? `${numAdult} Adult${numAdult > 1 ? 's' : ''}` : null,
    numChild ? `${numChild} Child${numChild > 1 ? 'ren' : ''}` : null,
    numInfant ? `${numInfant} Infant${numInfant > 1 ? 's' : ''}` : null,
  ].filter(Boolean).join(', ');
  const arrival = formatDate(booking?.arrival);
  const days = booking?.days || '';
  const numRoom = booking?.numRoom || 1;

  // Price breakdown (Room + Extra Bed)
  const main = booking?.priceBreakdown?.main || {};
  const extrabed = booking?.priceBreakdown?.extraBed || null;
  const baseAmount = main?.amount || 0;
  const cgst = main?.cgst || 0;
  const sgst = main?.sgst || 0;
  const extrabedAmount = extrabed?.amount || 0;
  const extrabedCgst = extrabed?.cgst || 0;
  const extrabedSgst = extrabed?.sgst || 0;
  const hasExtraBed = extrabedAmount > 0;
  const totalCgst = cgst + (hasExtraBed ? extrabedCgst : 0);
  const totalSgst = sgst + (hasExtraBed ? extrabedSgst : 0);
  const totalTaxAmount = totalCgst + totalSgst;
  const subtotal = baseAmount + (hasExtraBed ? extrabedAmount : 0);
  const totalTaxPercent = subtotal > 0 ? ((totalTaxAmount / subtotal) * 100).toFixed(2) : 0;
  const finalAmount = subtotal + totalTaxAmount;
  const coupon = booking?.coupon || '';
  const invoiceNumber = booking?.invoiceNumber;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 print:bg-transparent" style={{overflowY:'auto'}}>
      <div
        ref={invoiceRef}
        className={`bg-white rounded-xl shadow-lg max-w-2xl w-full p-8 relative text-black print:shadow-none print:p-0 print:bg-white ${isExportingPdf ? '' : 'h-[90vh] overflow-y-auto'}`}
        style={{ fontFamily: 'Barlow, Arial, sans-serif', minWidth: '700px' }}
      >
        {/* Close Button */}
        { !isExportingPdf && (
          <button
            className="absolute top-2 right-2 bg-gray-400 rounded-full text-white px-2 hover:text-gray-700 text-xl font-bold print:hidden"
            onClick={onClose}
          >
            <span style={{ fontSize: '1.2em' }}>×</span>
          </button>
        ) }
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="bg-[#f5e9d9] w-44 h-16 flex items-center justify-center text-2xl font-bold mb-2 rounded"><img src="/logo.png" alt="" /></div>
            <div className="mt-2 text-sm">
              <div className="font-semibold">Thanks for your order,</div>
              <div className="text-gray-700 mt-2">
                <div><span className="inline-block w-16">Name</span> <span className="ml-2">{booking?.firstName} {booking?.lastName}</span></div>
                <div><span className="inline-block w-16">Call</span> <span className="ml-2">{booking?.callNo}</span></div>
                <div><span className="inline-block w-16">Email</span> <span className="ml-2">{booking?.email}</span></div>
                <div><span className="inline-block w-16">Address</span> <span className="ml-2">{booking?.address}</span></div>
              </div>
              <div className="mt-2 text-sm">Invoice Number: <span className="font-bold">{invoiceNumber}</span></div>
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="mb-2">
              <div className="font-semibold">Registration / GST Number</div>
              <div>Email: {booking?.email}</div>
              <div>Contact Number: {booking?.callNo}</div>
              <div>Address: {booking?.address}</div>
            </div>
            <div className="font-bold text-md mt-2">Booking Order No</div>
            <div className="font-semibold">{bookingId}</div>
            <div className="font-bold text-md mt-2">Booking Date</div>
            <div>{formatDate(bookingDate)}</div>
          </div>
        </div>
        {/* Table */}
        <div className="grid grid-cols-2 gap-0 border-t border-b border-gray-400 mt-4 mb-2">
          <div className="bg-[#f5e9d9] font-bold border-r border-gray-400 py-2 px-3">Room Name</div>
          <div className="py-2 px-3">{roomName}</div>
          <div className="bg-[#f5e9d9] font-bold border-r border-gray-400 py-2 px-3">No Of Person</div>
          <div className="py-2 px-3">
            {numAdult > 0 && <div>Adult: {numAdult}</div>}
            {numChild > 0 && <div>Child: {numChild}</div>}
            {numInfant > 0 && <div>Infant: {numInfant}</div>}
          </div>
          <div className="bg-[#f5e9d9] font-bold border-r border-gray-400 py-2 px-3">Date Of Arrival</div>
          <div className="py-2 px-3">{arrival}</div>
          <div className="bg-[#f5e9d9] font-bold border-r border-gray-400 py-2 px-3">Number Of Days</div>
          <div className="py-2 px-3">{days}</div>
          <div className="bg-[#f5e9d9] font-bold border-r border-gray-400 py-2 px-3">Number Of Room Required</div>
          <div className="py-2 px-3">{numRoom}</div>
          <div className="bg-[#f5e9d9] font-bold border-r border-gray-400 py-2 px-3">Room Price</div>
          <div className="py-2 px-3">Rs {baseAmount.toLocaleString()}</div>
          {hasExtraBed && (
            <React.Fragment>
              <div className="bg-[#f5e9d9] font-bold border-r border-gray-400 py-2 px-3">Extra Bed Price</div>
              <div className="py-2 px-3">Rs {extrabedAmount.toLocaleString()}</div>
            </React.Fragment>
          )}
        </div>
        {/* Price breakdown */}
        <div className="flex justify-end mt-6 mb-2">
          <div className="text-right w-64">
            {/* Room price */}
            <div className="flex justify-between mb-1"><span className="font-bold">Room Price</span> <span>Rs {baseAmount.toLocaleString()}</span></div>
            {/* Extra Bed */}
            {hasExtraBed && (
              <div className="flex justify-between mb-1"><span className="font-bold">Extra Bed Price</span> <span>Rs {extrabedAmount.toLocaleString()}</span></div>
            )}
            {/* Subtotal */}
            <div className="flex justify-between mb-1"><span className="font-bold">Subtotal ({hasExtraBed ? 'Room + Extra Bed' : 'Room'})</span> <span>Rs {subtotal.toLocaleString()}</span></div>
            {/* Coupon */}
            {coupon && <div className="text-xs text-gray-600 mb-1">Applied Coupon Code</div>}
            {/* CGST/SGST */}
            <div className="flex justify-between mb-1"><span className="font-bold">CGST ({hasExtraBed ? 'Room + Extra Bed' : 'Room'})</span> <span>Rs {totalCgst.toLocaleString()}</span></div>
            <div className="flex justify-between mb-1"><span className="font-bold">SGST ({hasExtraBed ? 'Room + Extra Bed' : 'Room'})</span> <span>Rs {totalSgst.toLocaleString()}</span></div>
            {/* Total Tax */}
            <div className="flex justify-between mb-1"><span className="font-bold">Total Tax ({totalTaxPercent}%)</span> <span>Rs {totalTaxAmount.toLocaleString()}</span></div>
            <div className="border-t border-gray-400 my-2"></div>
            <div className="flex justify-between text-lg font-bold"><span>Total Amount</span> <span>Rs {finalAmount.toLocaleString()}</span></div>
          </div>
        </div>
        {/* Notice */}
        <div className="text-xs text-gray-800 mt-4 mb-2">
          Dear Guest,<br />We kindly request you to consider this invoice copy as your official booking voucher. Please keep it for your reference and present it at check-in, if required. Should you have any questions or need further assistance, feel free to reach out to our team.<br /><br />
          <span className="font-semibold">Please do not reply to this email. Emails sent to this address will not be answered.</span>
        </div>
        {/* Download PDF Button */}
        { !isExportingPdf && (
          <div className="flex justify-end mt-2">
            <button
              className="bg-black text-white px-6 py-2 rounded font-semibold"
              disabled={isExportingPdf}
              onClick={async () => {
                setIsExportingPdf(true);
                await new Promise(resolve => setTimeout(resolve, 50)); // let hidden clone render
                const html2canvas = (await import('html2canvas')).default;
                const exportElement = exportRef.current;
                if (!exportElement) {
                  setIsExportingPdf(false);
                  return;
                }
                const canvas = await html2canvas(exportElement, { scale: 2, backgroundColor: '#fff' });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgProps = { width: canvas.width, height: canvas.height };
                const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
                const imgWidth = imgProps.width * ratio;
                const imgHeight = imgProps.height * ratio;
                pdf.addImage(imgData, 'PNG', (pdfWidth - imgWidth) / 2, 20, imgWidth, imgHeight, undefined, 'FAST');
                pdf.save(`Invoice-${invoiceNumber || 'Booking'}.pdf`);
                setIsExportingPdf(false);
              }}
            >
              Download PDF
            </button>
          </div>
        )}
        {/* Hidden export clone for PDF generation */}
        {isExportingPdf && (
          <div
            ref={exportRef}
            style={{ position: 'fixed', left: '-9999px', top: 0, width: '800px', background: '#fff', zIndex: -1 }}
          >
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8 relative text-black print:shadow-none print:p-0 print:bg-white" style={{ fontFamily: 'Barlow, Arial, sans-serif', minWidth: '700px' }}>
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="bg-[#f5e9d9] w-44 h-16 flex items-center justify-center text-2xl font-bold mb-2 rounded"><img src="/logo.png" alt="" /></div>
                  <div className="mt-2 text-sm">
                    <div className="font-semibold">Thanks for your order,</div>
                    <div className="text-gray-700 mt-2">
                      <div><span className="inline-block w-16">Name</span> <span className="ml-2">{booking?.firstName} {booking?.lastName}</span></div>
                      <div><span className="inline-block w-16">Call</span> <span className="ml-2">{booking?.callNo}</span></div>
                      <div><span className="inline-block w-16">Email</span> <span className="ml-2">{booking?.email}</span></div>
                      <div><span className="inline-block w-16">Address</span> <span className="ml-2">{booking?.address}</span></div>
                    </div>
                    <div className="mt-2 text-sm">Invoice Number: <span className="font-bold">{invoiceNumber}</span></div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="mb-2">
                    <div className="font-semibold">Registration / GST Number</div>
                    <div>Email: {booking?.email}</div>
                    <div>Contact Number: {booking?.callNo}</div>
                    <div>Address: {booking?.address}</div>
                  </div>
                  <div className="font-bold text-md mt-2">Booking Order No</div>
                  <div className="font-semibold">{bookingId}</div>
                  <div className="font-bold text-md mt-2">Booking Date</div>
                  <div>{formatDate(bookingDate)}</div>
                </div>
              </div>
              {/* Table */}
              <div className="grid grid-cols-2 gap-0 border-t border-b border-gray-400 mt-4 mb-2">
                <div className="bg-[#f5e9d9] font-bold border-r border-gray-400 py-2 px-3">Room Name</div>
                <div className="py-2 px-3">{roomName}</div>
                <div className="bg-[#f5e9d9] font-bold border-r border-gray-400 py-2 px-3">No Of Person</div>
                <div className="py-2 px-3">
                  {numAdult > 0 && <div>Adult: {numAdult}</div>}
                  {numChild > 0 && <div>Child: {numChild}</div>}
                  {numInfant > 0 && <div>Infant: {numInfant}</div>}
                </div>
                <div className="bg-[#f5e9d9] font-bold border-r border-gray-400 py-2 px-3">Date Of Arrival</div>
                <div className="py-2 px-3">{arrival}</div>
                <div className="bg-[#f5e9d9] font-bold border-r border-gray-400 py-2 px-3">Number Of Days</div>
                <div className="py-2 px-3">{days}</div>
                <div className="bg-[#f5e9d9] font-bold border-r border-gray-400 py-2 px-3">Number Of Room Required</div>
                <div className="py-2 px-3">{numRoom}</div>
                <div className="bg-[#f5e9d9] font-bold border-r border-gray-400 py-2 px-3">Room Price</div>
                <div className="py-2 px-3">Rs {baseAmount.toLocaleString()}</div>
                {hasExtraBed && (
                  <React.Fragment>
                    <div className="bg-[#f5e9d9] font-bold border-r border-gray-400 py-2 px-3">Extra Bed Price</div>
                    <div className="py-2 px-3">Rs {extrabedAmount.toLocaleString()}</div>
                  </React.Fragment>
                )}
              </div>
              {/* Price Breakdown */}
              <div className="flex justify-end mt-6 mb-2">
                <div className="text-right w-64">
                  <div className="flex justify-between mb-1"><span className="font-bold">Room Price</span> <span>Rs {baseAmount.toLocaleString()}</span></div>
                  {hasExtraBed && (
                    <div className="flex justify-between mb-1"><span className="font-bold">Extra Bed Price</span> <span>Rs {extrabedAmount.toLocaleString()}</span></div>
                  )}
                  <div className="flex justify-between mb-1"><span className="font-bold">Subtotal ({hasExtraBed ? 'Room + Extra Bed' : 'Room'})</span> <span>Rs {subtotal.toLocaleString()}</span></div>
                  {coupon && <div className="text-xs text-gray-600 mb-1">Applied Coupon Code</div>}
                  <div className="flex justify-between mb-1"><span className="font-bold">CGST ({hasExtraBed ? 'Room + Extra Bed' : 'Room'})</span> <span>Rs {totalCgst.toLocaleString()}</span></div>
                  <div className="flex justify-between mb-1"><span className="font-bold">SGST ({hasExtraBed ? 'Room + Extra Bed' : 'Room'})</span> <span>Rs {totalSgst.toLocaleString()}</span></div>
                  <div className="flex justify-between mb-1"><span className="font-bold">Total Tax ({totalTaxPercent}%)</span> <span>Rs {totalTaxAmount.toLocaleString()}</span></div>
                  <div className="border-t border-gray-400 my-2"></div>
                  <div className="flex justify-between text-lg font-bold"><span>Total Amount</span> <span>Rs {finalAmount.toLocaleString()}</span></div>
                </div>
              </div>
              {/* Notice */}
              <div className="text-xs text-gray-800 mt-4 mb-2">
                Dear Guest,<br />We kindly request you to consider this invoice copy as your official booking voucher. Please keep it for your reference and present it at check-in, if required. Should you have any questions or need further assistance, feel free to reach out to our team.<br /><br />
                <span className="font-semibold">Please do not reply to this email. Emails sent to this address will not be answered.</span>
              </div>
              <div className="text-center text-xs text-gray-600 mt-4 pb-4 pt-2">This is an automated system-generated invoice – please do not reply to this message.</div>
              <div className="text-center text-xs mt-1 font-semibold pb-4">Copyright {new Date().getFullYear()} All rights reserved.</div>
            </div>
          </div>
        )}
        <div className="text-center text-xs text-gray-600 mt-4 pb-4 pt-2">This is an automated system-generated invoice – please do not reply to this message.</div>
        <div className="text-center text-xs mt-1 font-semibold pb-4">Copyright {new Date().getFullYear()} All rights reserved.</div>
      </div>
    </div>
  );
};

export default InvoiceModal;
