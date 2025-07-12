"use client"
import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import InvoiceModal from './InvoiceModal';
const stateList = [
    "Uttarakhand", "Uttar Pradesh", "Delhi", "Haryana", "Punjab", "Himachal Pradesh", "Rajasthan", "Maharashtra", "Karnataka", "Tamil Nadu", "Kerala", "West Bengal", "Gujarat", "Madhya Pradesh", "Bihar", "Jharkhand", "Goa", "Assam", "Odisha", "Chhattisgarh", "Telangana", "Andhra Pradesh", "Sikkim", "Tripura", "Nagaland", "Manipur", "Mizoram", "Meghalaya", "Arunachal Pradesh", "Jammu & Kashmir", "Ladakh"
];

import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
const BookingDetails = ({ room, onClose, type }) => {
    
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [bookingId, setBookingId] = useState('');
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    // Step state
    const [step, setStep] = useState(1);
    // Form data state
    const [form, setForm] = useState({
        arrival: '',
        departure: '',
        days: 1,
        firstName: '',
        lastName: '',
        email: '',
        callNo: '',
        altCallNo: '',
        address: '',
        city: '',
        district: '',
        state: '',
        adult: '',
        infant: '',
        child: '',
        specialReq: '',
        offers: [],
    });
    const [promo, setPromo] = useState('');
    const [applied, setApplied] = useState(false);
    const [discount, setDiscount] = useState(100);
    const [invoiceData, setInvoiceData] = useState(null);
    const roomName = room?.title || 'Room Name';
    const roomImg = room?.mainPhoto?.url || '/placeholder.jpeg';

    // Offer list
    const offerList = [
        'Rafting',
        'Local sightseeing',
        'Pickup Require',
        'Dropp Off Require',
        'Bike On Rent',
        'Yoga Classes',
        'Spa & Massage',
    ];

    // Handlers
    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    }
    const handleOfferToggle = offer => setForm(prev => ({ ...prev, offers: prev.offers.includes(offer) ? prev.offers.filter(o => o !== offer) : [...prev.offers, offer] }));

    // Step content
    // Error state for validation
    const [errors, setErrors] = useState({});

    // Validation function for each step
    const validateStep = () => {
        let stepErrors = {};
        if (step === 1) {
            if (!form.arrival) stepErrors.arrival = 'Arrival date is required';
            if (!form.departure) stepErrors.departure = 'Departure date is required';
            if (!form.days || form.days < 1) stepErrors.days = 'Number of days must be at least 1';
        } else if (step === 2) {
            if (!form.firstName) stepErrors.firstName = 'First name is required';
            if (!form.lastName) stepErrors.lastName = 'Last name is required';
            if (!form.email) stepErrors.email = 'Email is required';
            if (!form.callNo) stepErrors.callNo = 'Phone number is required';
            if (!form.address) stepErrors.address = 'Address is required';
            if (!form.city) stepErrors.city = 'City is required';
            if (!form.district) stepErrors.district = 'District is required';
            if (!form.state) stepErrors.state = 'State is required';
            if (!form.adult) stepErrors.adult = 'Number of adults is required';
        } else if (step === 3) {
            // No required fields in step 3, but you can add if needed
        }
        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    };

    // Handler for next step with validation
    const handleNextStep = () => {
        if (validateStep()) {
            setErrors({});
            setStep(step + 1);
        }
    };

    // Handler for previous step
    const handlePrevStep = () => {
        setErrors({});
        setStep(step - 1);
    };

    let stepContent;
    if (step === 1) {
        stepContent = (
            <>
                <div className="mb-6">
                    <div className="font-semibold italic text-md mb-2">Dear Guest, To proceed with your booking order and ensure smooth booking experience, we kindly request you to provide the following basic information.</div>
                    <hr className="mb-4 border-gray-300" />
                </div>
                <div className="mb-8">
                    <div className="font-bold text-md text-[#8a6a2f] mb-4">Arrival Date</div>
                    <div className="flex flex-col items-center mb-8">
                        <input
                            type="date"
                            className="w-full bg-gray-200 rounded-full px-5 py-2 text-md focus:outline-none appearance-none"
                            value={form.arrival}
                            onChange={e => handleChange('arrival', e.target.value)}
                        />
                        {errors.arrival && <div className="text-red-600 text-xs mt-1">{errors.arrival}</div>}
                    </div>
                    <div className="font-bold text-md text-[#8a6a2f] mb-4">Departure Date</div>
                    <div className="flex flex-col items-center mb-8">
                        <input
                            type="date"
                            className="w-full bg-gray-200 rounded-full px-5 py-2 text-md focus:outline-none appearance-none"
                            value={form.departure}
                            onChange={e => handleChange('departure', e.target.value)}
                        />
                        {errors.departure && <div className="text-red-600 text-xs mt-1">{errors.departure}</div>}
                    </div>
                    <div className="font-bold text-md text-[#8a6a2f] mb-3">Total Days For Stay</div>
                    <div className="flex items-center bg-gray-200 rounded-full px-2 py-2 w-full mb-8">
                        <button className="text-2xl px-4" onClick={() => handleChange('days', Math.max(1, (form.days || 1) - 1))}>-</button>
                        <span className="flex-1 text-center text-2xl font-semibold">{form.days || 1}</span>
                        {errors.days && <div className="text-red-600 text-xs mt-1">{errors.days}</div>}
                        <button className="text-2xl px-4" onClick={() => handleChange('days', (form.days || 1) + 1)}>+</button>
                    </div>
                </div>
                <div className="flex gap-2 mt-10">
                    {step > 1 && (
                        <button className="px-4 py-2 bg-gray-200 rounded text-black text-sm" onClick={handlePrevStep}>
                            Back
                        </button>
                    )}
                    <button className="flex-1 bg-black text-white font-semibold text-lg py-4 rounded-md" onClick={handleNextStep}>
                        Looks Good, Keep Going
                    </button>
                </div>
            </>
        );
    } else if (step === 2) {
        stepContent = (
            <>
                <div className="overflow-y-auto max-h-[90vh] pr-2">
                    <div className="mb-2">
                        <div className="font-semibold italic text-md mb-2">Dear Guest, To proceed with your booking order and ensure smooth booking experience, we kindly request you to provide the following basic information.</div>
                        <hr className="mb-2 border-gray-300" />
                    </div>
                    <div className="font-bold text-md text-[#8a6a2f] mb-2">Basic Profile</div>
                    <div className="flex gap-4 mb-1">
                        <div className="flex-1">
                            <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                            <input id="firstName" placeholder="First Name" className="w-full bg-gray-200 rounded-full px-5 py-1 text-md" value={form.firstName} onChange={e => handleChange('firstName', e.target.value)} />
                            {errors.firstName && <div className="text-red-600 text-xs mt-1">{errors.firstName}</div>}
                        </div>
                        <div className="flex-1">
                            <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                            <input id="lastName" placeholder="Last Name" className="w-full bg-gray-200 rounded-full px-5 py-1 text-md" value={form.lastName} onChange={e => handleChange('lastName', e.target.value)} />
                            {errors.lastName && <div className="text-red-600 text-xs mt-1">{errors.lastName}</div>}
                        </div>
                    </div>
                    <div className="flex gap-4 mb-1">
                        <div className="flex-1">
                            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                            <input id="email" placeholder="@domain.com" className="w-full bg-gray-200 rounded-full px-5 py-1 text-md" value={form.email} onChange={e => handleChange('email', e.target.value)} />
                            {errors.email && <div className="text-red-600 text-xs mt-1">{errors.email}</div>}
                        </div>
                    </div>
                    <div className="flex gap-4 mb-1">
                        <div className="flex-1">
                            <label htmlFor="callNo" className="block text-xs font-medium text-gray-700 mb-1">Call No.</label>
                            <input
                                id="callNo"
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                maxLength={10}
                                placeholder="Enter Call Number"
                                className="w-full bg-gray-200 rounded-full px-5 py-1 text-md"
                                value={form.callNo}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val) && val.length <= 10) {
                                        handleChange('callNo', val);
                                    }
                                }}
                            />


                            {errors.callNo && <div className="text-red-600 text-xs mt-1">{errors.callNo}</div>}
                        </div>
                        <div className="flex-1">
                            <label htmlFor="altCallNo" className="block text-xs font-medium text-gray-700 mb-1">Alt. Call No.</label>
                            <input
                                id="altCallNo"
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                maxLength={10}
                                placeholder="Enter Alt Call Number"
                                className="w-full bg-gray-200 rounded-full px-5 py-1 text-md"
                                value={form.altCallNo}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val) && val.length <= 10) {
                                        handleChange('altCallNo', val);
                                    }
                                }}
                            />


                        </div>
                    </div>
                    <hr className="my-2 border-gray-300" />
                    <div className="font-bold text-md text-[#8a6a2f] mb-2">Your Address</div>
                    <div className="mb-1">
                        <div className="mb-2">
                            <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                            <input id="address" placeholder="Address" className="w-full bg-gray-200 rounded-full px-5 py-1 text-md" value={form.address} onChange={e => handleChange('address', e.target.value)} />
                            {errors.address && <div className="text-red-600 text-xs mt-1">{errors.address}</div>}
                        </div>
                        <div className="flex gap-2">
                            <div className="w-[30%]">
                                <label htmlFor="city" className="block text-xs font-medium text-gray-700 mb-1">City</label>
                                <input id="city" placeholder="City" className="w-full bg-gray-200 rounded-full px-5 py-1 text-md" value={form.city} onChange={e => handleChange('city', e.target.value)} />
                                {errors.city && <div className="text-red-600 text-xs mt-1">{errors.city}</div>}
                            </div>
                            <div className="w-[30%]">
                                <label htmlFor="district" className="block text-xs font-medium text-gray-700 mb-1">Dist.</label>
                                <input id="district" placeholder="Dist." className="w-full bg-gray-200 rounded-full px-5 py-1 text-md" value={form.district} onChange={e => handleChange('district', e.target.value)} />
                                {errors.district && <div className="text-red-600 text-xs mt-1">{errors.district}</div>}
                            </div>
                            <div className="w-[40%]">
                                <label htmlFor="state" className="block text-xs font-medium text-gray-700 mb-1">State</label>
                                <select
                                    id="state"
                                    className="w-full bg-gray-200 rounded-full px-5 py-2 text-md"
                                    value={form.state}
                                    onChange={e => handleChange('state', e.target.value)}
                                >
                                    {errors.state && <div className="text-red-600 text-xs mt-1">{errors.state}</div>}
                                    <option value="">Select State</option>
                                    {stateList.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <hr className="my-2 border-gray-300" />
                    <div className="font-bold text-md text-[#8a6a2f] mb-2">Total Number Of Person</div>
                    <div className="flex gap-4 mb-1">
                        <div className="w-[30%]">
                            <label htmlFor="adult" className="block text-xs font-medium text-gray-700 mb-1">Adult</label>
                            <input id="adult" type='number' placeholder="Adult" className="w-full bg-gray-200 rounded-full px-5 py-1 text-md" value={form.adult} onChange={e => handleChange('adult', e.target.value)} />
                            {errors.adult && <div className="text-red-600 text-xs mt-1">{errors.adult}</div>}
                        </div>
                        <div className="w-[30%]">
                            <label htmlFor="infant" className="block text-xs font-medium text-gray-700 mb-1">Infant</label>
                            <input id="infant" type='number' placeholder="Infant" className="w-full bg-gray-200 rounded-full px-5 py-1 text-md" value={form.infant} onChange={e => handleChange('infant', e.target.value)} />
                            {/* No validation for infant, but keep structure for consistency */}
                        </div>
                        <div className="w-[30%]">
                            <label htmlFor="child" className="block text-xs font-medium text-gray-700 mb-1">Child</label>
                            <input id="child" type='number' placeholder="Child" className="w-full bg-gray-200 rounded-full px-5 py-1 text-md" value={form.child} onChange={e => handleChange('child', e.target.value)} />
                        </div>
                    </div>
                    <div className="text-xs text-gray-700 my-2">Disclaimer: All rooms are based on a minimum double occupancy (2 persons). Extra beds are subject to availability and may incur additional charges depending on occupancy. Room configuration and amenities may vary.</div>
                    <div className="text-xs text-gray-700 my-2">Child Policy: Children up to 6 years stay complimentary when sharing bed with parents. Children above 6 years will be considered as adults and charged accordingly.</div>
                    <div className="flex gap-2 mt-6">
                        {step > 1 && <button className="px-4 py-2 bg-gray-200 rounded text-black text-sm" onClick={() => setStep(step - 1)}>Back</button>}
                        <button className="flex-1 bg-black text-white font-semibold text-lg py-3 rounded-md" onClick={() => handleNextStep()}>Looks Good, Keep Going</button>
                    </div>
                </div>
            </>
        );
    } else if (step === 3) {
        stepContent = (
            <>
                <div className="mb-6">
                    <div className="font-semibold italic text-md mb-2">Dear Guest, To proceed with your booking order and ensure smooth booking experience, we kindly request you to provide the following basic information.</div>
                    <hr className="mb-4 border-gray-300" />
                </div>
                <div className="font-bold text-md text-[#8a6a2f] mb-2">Any Special Additional Requirement</div>
                <textarea className="w-full bg-gray-200 rounded-xl px-5 py-4 text-lg mb-6 min-h-[80px]" placeholder="Type here..." value={form.specialReq} onChange={e => handleChange('specialReq', e.target.value)} />
                <div className="font-bold text-md text-[#8a6a2f] mb-2">Additional Offer <span className="text-xs font-normal text-black">Please Click On Check List</span></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    {offerList.map(offer => (
                        <label key={offer} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={form.offers.includes(offer)} onChange={() => handleOfferToggle(offer)} />
                            <span className="font-semibold text-[15px] text-[#8a6a2f]">{offer}</span>
                        </label>
                    ))}
                </div>
                <div className="text-xs text-gray-700 my-2">Disclaimer: All rooms are based on a minimum double occupancy (2 persons). Extra beds are subject to availability and may incur additional charges depending on occupancy. Room configuration and amenities may vary.</div>
                <div className="text-xs text-gray-700 my-2">Child Policy: Children up to 6 years stay complimentary when sharing bed with parents. Children above 6 years will be considered as adults and charged accordingly.</div>
                <div className="flex gap-2 mt-6">
                    {step > 1 && <button className="px-4 py-2 bg-gray-200 rounded text-black text-sm" onClick={() => setStep(step - 1)}>Back</button>}
                    <button className="flex-1 bg-black text-white font-semibold text-lg py-3 rounded-md" onClick={() => setStep(step + 1)}>Looks Good, Keep Going</button>
                </div>
            </>
        );
    } else if (step === 4) {
        stepContent = (
            <>
                <div className="mb-6">
                    <div className="font-semibold italic text-[18px] mb-2">Final Booking Overview – Please Read Carefully Before Confirmation</div>
                    <div className="text-xs text-gray-700 mb-2">All rooms are based on double occupancy (minimum 2 persons). Extra beds are subject to availability. Please ensure all guest details, travel dates, and preferences are accurate. Changes after confirmation may be subject to availability and additional charges.</div>
                    <hr className="mb-4 border-gray-300" />
                </div>
                <div className="divide-y divide-gray-300 mb-6">
                    <div className="flex justify-between items-center py-2">
                        <span className="font-bold text-[#8a6a2f]">Date of arrival</span>
                        <span className="text-xs underline cursor-pointer" onClick={() => setStep(1)}>Edit</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="font-bold text-[#8a6a2f]">Basic Info</span>
                        <span className="text-xs underline cursor-pointer" onClick={() => setStep(2)}>Edit</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="font-bold text-[#8a6a2f]">your Address For Billing</span>
                        <span className="text-xs underline cursor-pointer" onClick={() => setStep(2)}>Edit</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="font-bold text-[#8a6a2f]">Total Number Of Person</span>
                        <span className="text-xs underline cursor-pointer" onClick={() => setStep(2)}>Edit</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="font-bold text-[#8a6a2f]">any specific requirements</span>
                        <span className="text-xs underline cursor-pointer" onClick={() => setStep(3)}>Edit</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="font-bold text-[#8a6a2f]">Additional Offer</span>
                        <span className="text-xs underline cursor-pointer" onClick={() => setStep(3)}>Edit</span>
                    </div>
                </div>
                <div className="flex gap-2 mt-6">
                    <button className="px-4 py-2 bg-gray-200 rounded text-black text-sm" onClick={() => setStep(step - 1)}>Back</button>
                    <button
                        className="flex-1 bg-black text-white font-semibold text-lg py-3 rounded-md"
                        onClick={async () => {
                            if (status === 'loading') return;
                            if (!session || !session.user) {
                                router.replace(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
                                return;
                            }
                            try {
                                if ((room?.type || type) === 'room') {
                                    // Generate a mixed alphanumeric booking ID
                                    function generateBookingId() {
                                        const now = new Date();
                                        const pad = n => n.toString().padStart(2, '0');
                                        const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
                                        const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
                                        return `HWR-${dateStr}-${rand}`;
                                    }
                                    const bookingIdVal = generateBookingId();
                                    // Extract detailed price breakdown as in sidebar
                                    const priceList = (room.prices && room.prices[0] && room.prices[0].prices) || [];
                                    const mainPrice = priceList.find(p => p.type === '02 Pax') || priceList.find(p => p.type === '01 Pax') || priceList[0] || {};
                                    const baseAmount = mainPrice?.amount || 0;
                                    const cgst = mainPrice?.cgst || 0;
                                    const sgst = mainPrice?.sgst || 0;
                                    const oldPrice = mainPrice?.oldPrice || 0;

                                    const extrabed = priceList.find(p => p.type === 'Extra Bed') || {};
                                    const extrabedAmount = extrabed?.amount || 0;
                                    const extrabedOldPrice = extrabed?.oldPrice || 0;
                                    const extrabedCgst = extrabed?.cgst || 0;
                                    const extrabedSgst = extrabed?.sgst || 0;
                                    const hasExtraBed = extrabedAmount > 0;

                                    const totalCgst = cgst + (hasExtraBed ? extrabedCgst : 0);
                                    const totalSgst = sgst + (hasExtraBed ? extrabedSgst : 0);
                                    const totalTaxAmount = totalCgst + totalSgst;
                                    const subtotal = baseAmount + (hasExtraBed ? extrabedAmount : 0);
                                    const totalTaxPercent = subtotal > 0 ? ((totalTaxAmount / subtotal) * 100).toFixed(2) : 0;
                                    const finalAmount = subtotal + totalTaxAmount;

                                    // Compose booking payload with detailed breakdown
                                    // Generate invoice number (date + random)
                                    const invoiceNumber = `INV${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,'0')}${new Date().getDate().toString().padStart(2,'0')}-${Math.random().toString(36).substring(2,8).toUpperCase()}`;

                                    const payload = {
                                        ...form, // include all user fields (firstName, lastName, callNo, email, address, etc)
                                        specialReq: form.specialReq,
                                        offers: form.offers,
                                        bookingId: bookingIdVal,
                                        invoiceNumber,
                                        userId: session.user.id || session.user._id,
                                        roomId: room?._id,
                                        type: 'room',
                                        roomName: room?.title || '',
                                        priceBreakdown: {
                                            main: {
                                                type: mainPrice?.type || '',
                                                amount: baseAmount,
                                                oldPrice: oldPrice,
                                                cgst: cgst,
                                                sgst: sgst,
                                            },
                                            extraBed: hasExtraBed ? {
                                                type: extrabed?.type || '',
                                                amount: extrabedAmount,
                                                oldPrice: extrabedOldPrice,
                                                cgst: extrabedCgst,
                                                sgst: extrabedSgst,
                                            } : null,
                                        },
                                        subtotal,
                                        totalCgst,
                                        totalSgst,
                                        totalTaxPercent,
                                        totalTaxAmount,
                                        finalAmount,
                                    };
                                    const res = await fetch('/api/bookingDetails', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(payload),
                                    });
                                    const data = await res.json();
                                    if (data.success) {
                                        toast.success('Booking successful!');
                                        setBookingId(bookingIdVal);
                                        setShowConfirmation(true); // Show confirmation UI
                                        setInvoiceData(
                                            payload
                                        );
                                    } else {
                                        toast.error(data.error || 'Booking failed');
                                    }
                                } else {
                                    // Placeholder for other types
                                    toast.error('Unsupported booking type');
                                }
                            } catch (err) {
                                toast.error('Booking failed: ' + err.message);
                            }
                        }}
                    >
                        Make Confirm Order
                    </button>
                </div>
            </>
        );
    }
    useEffect(() => {
        document.body.style.overflow = (showConfirmation || step > 0) ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [showConfirmation, step]);
    if (showInvoice) {
        // console.log('showInvoice', showInvoice, 'invoiceData', invoiceData);
        return (
            <InvoiceModal
            open={showInvoice}
            onClose={() => setShowInvoice(false)}
            booking={invoiceData}
            bookingId={bookingId}
            bookingDate={new Date()}
          />
        );
    }
    if (showConfirmation) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={onClose}>
                <div className="bg-white rounded-2xl shadow-lg max-w-xl w-full p-8 relative flex flex-col items-start text-start" onClick={e => e.stopPropagation()}>
                    <button
                        className="absolute top-3 right-3 bg-gray-400 rounded-full text-white p-2 hover:text-gray-700 text-xl font-bold"
                        onClick={onClose}
                    >
                        <span style={{ fontSize: '1.2em' }}><X /></span>
                    </button>

                    {/* Booking Order Number */}
                    <div className="text-md font-bold mb-2 tracking-wider flex">
                        Booking Order No.: <span className="ml-2 text-blue-800">{bookingId}</span>
                    </div>

                    {/* Confirmation Title */}
                    <div className="text-2xl italic font-bold mb-4 text-[#7a5b2b]">
                        Booking Order Confirmation
                    </div>

                    {/* Confirmation Message */}
                    <div className="text-base text-black mb-6 leading-relaxed">
                        Dear Guest, Thank you for choosing to stay with us. We are pleased to confirm that we have received your booking request.

                        Our team is now reviewing the details and will ensure all necessary arrangements are in place for your comfortable stay. You will receive a confirmation via email or phone call shortly.

                        If you have any special requests or need assistance, please feel free to contact us.
                        <br /><br />
                        <span className="font-semibold">We look forward to welcoming you!</span>
                    </div>

                    {/* Invoice Button */}
                    <button className="w-full bg-black text-white rounded-md py-3 font-semibold text-lg mb-3 hover:bg-gray-900" onClick={() => setShowInvoice(true)}>
                        Get receipt (Invoice)
                    </button>

                    {/* Dashboard Link */}
                    <div className="w-full">
                        <span
                            className="text-red-600 font-semibold text-base italic cursor-pointer"
                            onClick={onClose}
                        >
                            Or Go To Dashboard &gt;&gt;
                        </span>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-[#fcf9f4] rounded-2xl shadow-lg max-w-4xl w-full flex flex-col md:flex-row p-5 gap-8 relative" onClick={e => e.stopPropagation()}>
                {/* Close button */}
                <button className="absolute top-2 right-2 bg-gray-500 rounded-full text-white p-2  hover:text-gray-700 text-2xl font-bold" onClick={onClose}><X /></button>
                {/* Left: Step Content */}
                <div className="flex-1 min-w-[300px]">
                    {stepContent}
                </div>
                {/* Right: Room Summary */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 min-w-[300px] max-w-[400px] flex flex-col">
                    <div className="font-bold text-xl mb-2">{roomName}</div>
                    <div className="w-full h-36 relative mb-3 rounded-lg overflow-hidden">
                        <Image src={roomImg} alt={roomName} fill className="object-cover" />
                    </div>
                    {(() => {
                        if (!room?.prices || !Array.isArray(room.prices) || room.prices.length === 0) {
                            return (
                                <div className="text-red-600 font-semibold">No price data found for this room.<br />Check room.prices structure.</div>
                            );
                        }
                        const priceList = (room.prices && room.prices[0] && room.prices[0].prices) || [];
                        const mainPrice = priceList.find(p => p.type === '02 Pax') || priceList.find(p => p.type === '01 Pax') || priceList[0];

                        const baseAmount = mainPrice?.amount || 0;
                        const cgst = mainPrice?.cgst || 0;
                        const sgst = mainPrice?.sgst || 0;
                        const oldPrice = mainPrice?.oldPrice || 0;

                        const extrabed = priceList.find(p => p.type === 'Extra Bed');
                        const extrabedAmount = extrabed?.amount || 0;
                        const extrabedOldPrice = extrabed?.oldPrice || 0;
                        const extrabedCgst = extrabed?.cgst || 0;
                        const extrabedSgst = extrabed?.sgst || 0;

                        const hasExtraBed = extrabedAmount > 0;

                        const totalCgst = cgst + (hasExtraBed ? extrabedCgst : 0);
                        const totalSgst = sgst + (hasExtraBed ? extrabedSgst : 0);
                        const totalTaxAmount = totalCgst + totalSgst;

                        const subtotal = baseAmount + (hasExtraBed ? extrabedAmount : 0);
                        const totalTaxPercent = subtotal > 0 ? ((totalTaxAmount / subtotal) * 100).toFixed(2) : 0;
                        const finalAmount = subtotal + totalTaxAmount;

                        return (
                            <>
                                <div className="text-sm text-black mb-1">
                                    Showing Price For&nbsp;
                                    {priceList.some(p => p.type === '02 Pax')
                                        ? '02 Pax'
                                        : priceList.some(p => p.type === '01 Pax')
                                            ? '01 Pax'
                                            : 'N/A'}
                                </div>

                                <div className="font-bold text-lg mb-1">
                                    Room Price
                                    <span className="text-md text-gray-600 ml-2">
                                        <span className="float-right text-black flex items-center gap-2">
                                            Rs&nbsp;{baseAmount.toLocaleString()}
                                            {oldPrice > 0 && (
                                                <div className="text-sm text-gray-800 font-bold line-through">
                                                    Rs&nbsp;{oldPrice.toLocaleString()}
                                                </div>
                                            )}
                                        </span>
                                    </span>
                                </div>

                                <span className="text-sm text-black my-1">
                                    Extra bed available: {hasExtraBed ? 'Yes' : 'No'}
                                </span>

                                {hasExtraBed && (
                                    <div className="flex justify-between mt-1">
                                        <span className='text-md font-bold'>Extra Bed Amount</span>
                                        <div className="flex items-center gap-2">
                                            <span className='text-md text-black font-bold'>Rs&nbsp;{extrabedAmount.toLocaleString()}</span>
                                            {extrabedOldPrice > 0 && (
                                                <span className='text-sm text-black font-semibold line-through'>Rs&nbsp;{extrabedOldPrice.toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <hr className="my-2 border-gray-300" />

                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className='text-sm font-bold'>Subtotal ({hasExtraBed ? 'Room + Extra Bed' : 'Room'})</span>
                                        <span className='text-sm font-semibold'>Rs&nbsp;{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className='text-sm font-bold'>CGST ({hasExtraBed ? 'Room + Extra Bed' : 'Room'})</span>
                                        <span className='text-sm font-semibold'>Rs&nbsp;{totalCgst.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className='text-sm font-bold'>SGST ({hasExtraBed ? 'Room + Extra Bed' : 'Room'})</span>
                                        <span className='text-sm font-semibold'>Rs&nbsp;{totalSgst.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className='text-sm font-bold'>Total Tax ({totalTaxPercent}%)</span>
                                        <span className='text-sm font-semibold'>Rs&nbsp;{totalTaxAmount.toLocaleString()}</span>
                                    </div>
                                    <hr className="my-2 border-gray-300" />
                                    <div className="flex justify-between font-semibold mt-1">
                                        <span className='text-sm font-bold'>Final Amount</span>
                                        <span className='text-sm font-semibold'>Rs&nbsp;{finalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </>
                        );

                    })()}
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;
