"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
const stateList = [
    "Uttarakhand", "Uttar Pradesh", "Delhi", "Haryana", "Punjab", "Himachal Pradesh", "Rajasthan", "Maharashtra", "Karnataka", "Tamil Nadu", "Kerala", "West Bengal", "Gujarat", "Madhya Pradesh", "Bihar", "Jharkhand", "Goa", "Assam", "Odisha", "Chhattisgarh", "Telangana", "Andhra Pradesh", "Sikkim", "Tripura", "Nagaland", "Manipur", "Mizoram", "Meghalaya", "Arunachal Pradesh", "Jammu & Kashmir", "Ladakh"
];

import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
const BookingDetails = ({ room, onClose, type }) => {
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
    console.log(room)
    const price = room?.price || 2999;
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
                                    // Compose sidebar price info
                                    const priceObj = Array.isArray(room?.prices) && room.prices.length > 0 ? room.prices[0] : null;
                                    const baseAmount = priceObj?.amount || 0;
                                    const cgst = priceObj?.cgst || 0;
                                    const sgst = priceObj?.sgst || 0;
                                    const oldPrice = priceObj?.oldPrice || 0;
                                    const finalAmount = baseAmount + cgst + sgst;
                                    // Compose booking payload
                                    const payload = {
                                        ...form,
                                        userId: session.user.id || session.user._id,
                                        roomId: room?._id,
                                        type: 'room',
                                        roomName: room?.title || '',
                                        allPrices: room?.prices || [],
                                        selectedPriceType: priceObj?.type || '',
                                        priceDetails: {
                                            priceId: priceObj?._id,
                                            baseAmount,
                                            cgst,
                                            sgst,
                                            oldPrice,
                                            finalAmount,
                                        }
                                    };
                                    const res = await fetch('/api/bookingDetails', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(payload),
                                    });
                                    const data = await res.json();
                                    if (data.success) {
                                        toast.success('Booking successful!');
                                        if (onClose) onClose();
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
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={onClose}>
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
                        // Debug logs
                        console.log('BookingDetails Sidebar room:', room);
                        console.log('BookingDetails Sidebar room.prices:', room?.prices);
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
                        const finalAmount = baseAmount + cgst + sgst;
                        // const priceList = (item.prices && item.prices[0] && item.prices[0].prices) || [];
                        // return (
                        //     <div className="flex gap-8 text-sm">
                        //         <span>
                        //             Max occupancy: {
                        //                 priceList.some(p => p.type === '02 Pax')
                        //                     ? '02 Pax'
                        //                     : priceList.some(p => p.type === '01 Pax')
                        //                         ? '01 Pax'
                        //                         : 'N/A'
                        //             }
                        //         </span>
                        //         <span>
                        //             Extra bed available: {
                        //                 priceList.some(p => p.type === 'Extra Bed') ? 'Yes' : 'No'
                        //             }
                        //         </span>
                        //     </div>
                        // );
                        return (
                            <>
                                <div className="font-bold text-lg mb-1">Room Price <span className="text-xs text-gray-600 ml-2">{priceList.some(p => p.type === '02 Pax')
                                    ? '02 Pax'
                                    : priceList.some(p => p.type === '01 Pax')
                                    ? '01 Pax'
                                    : 'N/A'
                                }</span><span className="float-right text-black">Rs&nbsp;{baseAmount.toLocaleString()}</span></div>
                                {oldPrice > 0 && (
                                    <div className="text-md text-gray-800 line-through mb-1">Old Price: Rs&nbsp;{oldPrice.toLocaleString()}</div>
                                )}
                                <div className="text-xs text-gray-500 mb-2">Showing Price For 01 Day</div>
                                <span className="text-xs text-gray-500 mb-2">Extra bed available: {
                                    priceList.some(p => p.type === 'Extra Bed') ? 'Yes' : 'No'
                                }</span>
                                <hr className="my-2 border-gray-300" />
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="flex justify-between"><span>Total CGST</span><span>Rs&nbsp;{cgst.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span>Total SGST</span><span>Rs&nbsp;{sgst.toLocaleString()}</span></div>
                                    <div className="flex justify-between font-semibold mt-1"><span>Final Amount</span><span>Rs&nbsp;{finalAmount.toLocaleString()}</span></div>
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
