"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, X } from 'lucide-react';
import InvoiceModal from './InvoiceModal';
const stateList = [
    "Uttarakhand", "Uttar Pradesh", "Delhi", "Haryana", "Punjab", "Himachal Pradesh", "Rajasthan", "Maharashtra", "Karnataka", "Tamil Nadu", "Kerala", "West Bengal", "Gujarat", "Madhya Pradesh", "Bihar", "Jharkhand", "Goa", "Assam", "Odisha", "Chhattisgarh", "Telangana", "Andhra Pradesh", "Sikkim", "Tripura", "Nagaland", "Manipur", "Mizoram", "Meghalaya", "Arunachal Pradesh", "Jammu & Kashmir", "Ladakh"
];
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
const PackageBookingModel = ({ packages, onClose, type }) => {
    console.log(packages)

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [bookingId, setBookingId] = useState('');
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [openAccordion, setOpenAccordion] = React.useState(null);
    const [showFullDesc, setShowFullDesc] = React.useState(false);
    const desc = packages.description?.overview || "No Description";
    const words = desc.split(' ');
    const [uploadedID, setUploadedID] = useState(null); // { url, key }
    const [selectedID, setSelectedID] = useState(null); // url
    const [uploadingID, setUploadingID] = useState(false);
    const [uploadProgressID, setUploadProgressID] = useState(0);
    // Step state
    const [step, setStep] = useState(1);
    // Form data state
    const [form, setForm] = useState({
        arrival: '',
        id: '',
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
    const [invoiceData, setInvoiceData] = useState(null);
    const packageName = packages?.title || 'Room Name';
    const packageImg = packages?.gallery?.mainImage?.url || '/placeholder.jpeg';
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
        setForm(prev => ({ ...prev,
            [field]: value }));
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
            if (!form.id) stepErrors.id = 'ID is required';
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
    const handleIDChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingID(true);
        setUploadProgressID(0);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/cloudinary", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("ID upload failed");
            const result = await res.json();
            setUploadedID(result); // { url, key }
            setSelectedID(result.url);
            setForm(prev => ({
                ...prev,
                id: result.url // or { url: result.url, key: result.key } if you want more info
              }));
            toast.success("Document uploaded successfully");
        } catch (err) {
            toast.error("Document upload failed");
        } finally {
            setUploadingID(false);
            setUploadProgressID(0);
        }
    };
    const handleRemoveID = async () => {
        setUploadedID(null);
        setSelectedID(null);
        if (uploadedID && uploadedID.key) {
            try {
                const res = await fetch('/api/cloudinary', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ publicId: uploadedID.key }),
                });
                const data = await res.json();
                if (!res.ok) {
                    toast.error('Cloudinary error: ' + (data.error || 'Failed to delete document from Cloudinary'));
                }
            } catch (err) {
                toast.error('Failed to delete document from Cloudinary');
            }
        }
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

                    <div style={{ background: "#fff8ee", padding: 24, borderRadius: 8 }}>
                        <div style={{ fontWeight: 600, color: "#6d4b1e", marginBottom: 10 }}>
                            Kindly Provide Government-Approved ID for Office Use
                        </div>
                        {selectedID ? (
                            <div style={{ marginBottom: 10 }}>
                                <img src={selectedID} alt="Uploaded ID" style={{ maxWidth: 180, borderRadius: 8, marginBottom: 8 }} />
                                <div>
                                    <button onClick={handleRemoveID} style={{ color: "#fff", background: "#e74c3c", border: "none", padding: "6px 14px", borderRadius: 6 }}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ): uploadingID ? (
                        <div style={{
                            background: "#ff4d1c",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 22,
                            padding: "10px 0",
                            borderRadius: 28,
                            textAlign: "center",
                            marginBottom: 10
                        }}>
                            Uploading...
                        </div>
                        ) : (
                        <label style={{ display: "block", marginBottom: 10 }}>
                            <input type="file" accept="image/*" onChange={handleIDChange} style={{ display: "none" }} disabled={uploadingID} />
                            <div style={{
                                background: "#ff4d1c",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: 22,
                                padding: "10px 0",
                                borderRadius: 28,
                                textAlign: "center",
                                cursor: "pointer"
                            }}>
                                Uplode From Here
                            </div>
                        </label>
)}
                        <div style={{ fontSize: 15, marginTop: 8 }}>
                            We request you to submit any one of the following valid government-issued identification documents for official records:
                            <br />
                            <span style={{ fontWeight: 600 }}>Aadhar Card, Passport, Driving Licence, Voter ID</span>
                            <br />
                            Your cooperation is appreciated.
                        </div>
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
        // Accordion state for expanded section

        const accordionSections = [
            {
                key: 'arrival',
                label: 'Date of Arrival',
                value: form.arrival || 'Not set',
            },
            {
                key: 'Document Image',
                label: 'Document Image',
                value: form.id || 'Not Uploaded',
            },
            {
                key: 'basic',
                label: 'Basic Info',
                value: (
                    <div>
                        Name: {form.firstName} {form.lastName} <br />
                        Email: {form.email} <br />
                        Phone: {form.callNo}
                    </div>
                ),
            },
            {
                key: 'address',
                label: 'Your Address For Billing',
                value: form.address || 'Not set',
            },
            {
                key: 'persons',
                label: 'Total Number Of Person',
                value: form.adult + ' Adult ' + (form.child ? form.child + ' Child ' : '') + (form.infant ? form.infant + ' Infant' : '') || 'Not set',
            },
            {
                key: 'specialReq',
                label: 'Any specific requirements',
                value: form.specialReq || 'Not set',
            },
            {
                key: 'offers',
                label: 'Additional Offer',
                value: (
                    <div className='flex items-center gap-2'>
                        {form.offers.join(', ')}
                    </div>
                ) || 'Not set',
            },
        ];
        stepContent = (
            <>
                <div className="mb-6">
                    <div className="font-semibold italic text-[18px] mb-2">Final Booking Overview – Please Read Carefully Before Confirmation</div>
                    <div className="text-xs text-gray-700 mb-2">All rooms are based on double occupancy (minimum 2 persons). Extra beds are subject to availability. Please ensure all guest details, travel dates, and preferences are accurate. Changes after confirmation may be subject to availability and additional charges.</div>
                    <hr className="mb-4 border-gray-300" />
                </div>
                <div className="divide-y divide-gray-300 mb-6 max-h-[60vh] overflow-y-auto">
                    {accordionSections.map(section => (
                        <div key={section.key} className="py-2">
                            <div
                                className="flex justify-between items-center cursor-pointer select-none"
                                onClick={() => setOpenAccordion(openAccordion === section.key ? null : section.key)}
                            >
                                <span className="font-bold text-[#8a6a2f]">{section.label}</span>
                                <span className="text-xs text-gray-700">{openAccordion === section.key ? '▲' : '▼'}</span>
                            </div>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === section.key ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="text-sm text-gray-700 px-1 py-1">
                                    {section.value}
                                </div>
                            </div>
                        </div>
                    ))}

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
                                if ((packages?.type || type) === 'packages') {
                                    function generateBookingId() {
                                        const now = new Date();
                                        const pad = n => n.toString().padStart(2, '0');
                                        const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
                                        return `HWR-${dateStr}`;
                                    }
                                    const bookingIdVal = generateBookingId();
                                    const packagesPrices = {
                                        onePerson: Array.isArray(packages?.packagePrice?.onePerson) ? packages.packagePrice.onePerson : [],
                                        twoPerson: Array.isArray(packages?.packagePrice?.twoPerson) ? packages.packagePrice.twoPerson : [],
                                        eightPerson: Array.isArray(packages?.packagePrice?.eightPerson) ? packages.packagePrice.eightPerson : [],
                                      };
                                   

                                    const invoiceNumber = `INV${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

                                    const payload = {
                                        ...form,
                                        specialReq: form.specialReq,
                                        offers: form.offers,
                                        bookingId: bookingIdVal,
                                        invoiceNumber,
                                        userId: session.user.id || session.user._id,
                                        packagesId: packages?._id,
                                        type: 'packages',
                                        packageName: packages?.title || '',
                                        packagesPrices,                
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
                                        setShowConfirmation(true);
                                        setInvoiceData(payload);
                                        if (form.email) {
                                            try {
                                                const [{ default: ReactDOMServer }, { default: BeautifulInvoice }] = await Promise.all([
                                                    import('react-dom/server'),
                                                    import('./BeautifulInvoice'),
                                                ]);
                                                const invoiceHtml = ReactDOMServer.renderToStaticMarkup(
                                                    <BeautifulInvoice
                                                        booking={payload}
                                                        bookingId={bookingIdVal}
                                                        bookingDate={new Date()}
                                                        invoiceNumber={payload.invoiceNumber}
                                                    />
                                                );
                                                const resEmail = await fetch('/api/brevo', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        to: form.email,
                                                        subject: `Your Booking Invoice - ${packages?.title || 'Himalayan Wellness Retreat'}`,
                                                      
                                                        htmlContent: invoiceHtml,
                                                    })
                                                });
                                                const emailRes = await resEmail.json();
                                                if (emailRes.success) {
                                                    toast.success('Invoice sent to your email!');
                                                } else {
                                                    toast.error('Failed to send invoice email.');
                                                }
                                            } catch (err) {
                                                toast.error('Error sending invoice: ' + err.message);
                                            }
                                        }

                                    } else {
                                        toast.error(data.error || 'Booking failed');
                                    }
                                } else {
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
        return (
            <InvoiceModal
                open={showInvoice}
                onClose={() => setShowInvoice(false)}
                booking={invoiceData}
                bookingId={bookingId}
                bookingDate={new Date()}
                invoiceNumber={invoiceData.invoiceNumber}
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
                        Booking Order Under Review
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
                        Invoice Booking Voucheri
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
            <div className="bg-[#fcf9f4] rounded-2xl shadow-lg max-w-4xl w-full flex flex-col md:flex-row p-5 gap-4 relative" onClick={e => e.stopPropagation()}>
                {/* Close button */}
                <button className="absolute top-1 right-1 bg-gray-500 rounded-full text-white p-1 hover:text-gray-700 text-xl font-bold" onClick={onClose}><X /></button>
                {/* Left: Step Content */}
                <div className="flex-1 max-w-[500px]">
                    {stepContent}
                </div>
                {/* Right: Room Summary */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-md p-2 max-w-[350px] w-full flex flex-col">
                    <div className="w-full h-60 relative mb-3 rounded-lg overflow-hidden">
                        <Image src={packageImg} alt={packageName} fill className="object-contain" />
                    </div>
                    <div className="p-2">
                        <div className="flex items-center justify-between">
                            <div className="font-bold text-md  mb-2">{packageName}</div>
                            {packages?.code && (
                                <span className="text-sm text-black my-2 md:my-0 w-fit font-mono bg-gray-100 px-2 py-1 rounded border border-gray-200">Code: {packages?.code}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mb-3 md:mb-0">
                            <span className="font-semibold flex items-center">
                                {(() => {
                                    if (Array.isArray(packages?.reviews) && packages.reviews.length > 0) {
                                        const avg = packages.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / packages.reviews.length;
                                        return avg.toFixed(1);
                                    }
                                    return "0";
                                })()} Rating</span>
                            <span className="text-gray-700 text-sm">({packages.reviews?.length || 0} customer reviews)</span>
                        </div>
                        {(() => {

                            if (desc === "No Description") {
                                return <p className="text-gray-700 mb-4 max-w-lg">No Description</p>;
                            }
                            if (showFullDesc || words.length <= 10) {
                                return (
                                    <div className="text-gray-700 my-6 text-md max-w-lg">
                                        <div dangerouslySetInnerHTML={{ __html: desc }} />
                                        {words.length > 10 && (
                                            <>
                                                {' '}<button className="text-blue-600 underline ml-2" onClick={() => setShowFullDesc(false)}>Close</button>
                                            </>
                                        )}
                                    </div>
                                );
                            }
                            return (
                                <div className="text-gray-700 my-4 text-md max-w-lg">
                                    <div dangerouslySetInnerHTML={{ __html: words.slice(0, 10).join(' ') + '...' }} />
                                    <button className="text-blue-600 underline" onClick={() => setShowFullDesc(true)}>Read more</button>
                                </div>
                            );
                        })()}
                        <div className="mb-6">
                            {/* Package Price Table */}
                            <div className="text-green-800 font-bold text-sm mb-1 text-right">Package Price: Base Rate</div>
                            <table className="w-full border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-orange-100">
                                        <th className="text-green-800 text-sm font-semibold px-3 py-2 text-left rounded-tl-sm">Accommodation Type</th>
                                        <th className="text-green-800 text-sm font-semibold px-3 py-2 text-left">In INR</th>
                                        <th className="text-green-800 text-sm font-semibold px-3 py-2 text-left rounded-tr-lg">US Dollar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* One Person */}

                                    {Array.isArray(packages?.packagePrice?.onePerson) && packages?.packagePrice.onePerson.length > 0 && (
                                        <>
                                            <tr>
                                                <td colSpan={3} className="font-semibold text-sm text-black text-start px-2">
                                                    Base Price : 01 Person
                                                </td>
                                            </tr>
                                            {packages?.packagePrice.onePerson.map((item, idx) => (
                                                <tr key={`onePerson-${idx}`} className="bg-blue-200 border-y-2 border-white">
                                                    <td className="px-3 py-1">{item.type || "1 Person"}</td>
                                                    <td className="px-3 py-1 border-l-2 border-red-500">{item.inr}</td>
                                                    <td className="px-3 py-1 border-l-2 border-red-500">{item.usd}</td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                    {/* Two Person */}
                                    {Array.isArray(packages?.packagePrice?.twoPerson) && packages?.packagePrice.twoPerson.length > 0 && (
                                        <>
                                            <tr><td colSpan={3} className="font-semibold text-black text-start px-2 py-1 text-sm">
                                                Base Price : 02 Person
                                            </td>
                                            </tr>
                                            {packages?.packagePrice.twoPerson.map((item, idx) => (
                                                <tr key={`twoPerson-${idx}`} className="bg-blue-100 border-y-2 border-white">
                                                    <td className="px-3 py-1">{item.type || "2 Person"}</td>
                                                    <td className="px-3 py-1 border-l-2 border-red-500">{item.inr}</td>
                                                    <td className="px-3 py-1 border-l-2 border-red-500">{item.usd}</td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                    {/* Eight Person */}
                                    {Array.isArray(packages?.packagePrice?.eightPerson) && packages?.packagePrice.eightPerson.length > 0 && (
                                        <>
                                            <tr><td colSpan={3} className="font-semibold text-black text-start px-2 py-1 text-sm">
                                                Base Price : 08 Person
                                            </td>
                                            </tr>
                                            {packages?.packagePrice.eightPerson.map((item, idx) => (
                                                <tr key={`eightPerson-${idx}`} className="bg-blue-50 border-y-2 border-white">
                                                    <td className="px-3 py-1">{item.type || "8 Person"}</td>
                                                    <td className="px-3 py-1 border-l-2 border-red-500">{item.inr}</td>
                                                    <td className="px-3 py-1 border-l-2 border-red-500">{item.usd}</td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageBookingModel;
