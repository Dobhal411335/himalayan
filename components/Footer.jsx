'use client'

import { Handshake, Phone, Send, MapPin } from "lucide-react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter } from "./ui/card"
import Image from "next/image"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import toast from "react-hot-toast"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion"
import CurrentYear from './CurrentYear';
const Footer = () => {
    const pathName = usePathname()
    const [pages, setPages] = useState([])

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const response = await fetch("/api/getAllPages")
                const data = await response.json()
                setPages(data.pages)
            } catch (error) {
                console.error("Error fetching pages:", error)
            }
        }
        fetchPages()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value.trim();
        if (!email) {
            return toast.error("Please Enter Your Email", { style: { borderRadius: "10px", border: "2px solid red" } });
        }
        try {
            const res = await fetch('/api/newsLetter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Thank you for Subscibing!", { style: { borderRadius: "10px", border: "2px solid green" } });
                e.target.reset();
            } else {
                toast.error(data.message || "Subscription failed.", { style: { borderRadius: "10px", border: "2px solid red" } });
            }
        } catch {
            toast.error("An error occurred.", { style: { borderRadius: "10px", border: "2px solid red" } });
        }
    };

    return (
        <footer className={`print:hidden ${pathName.includes('admin') && 'hidden'}
         ${pathName.includes('artisan') && 'block'} ${pathName.includes('product') && 'block'} ${pathName.includes('customEnquiry') && 'hidden'} ${pathName.includes('checkout') && 'hidden'}  ${pathName.includes('category') && 'block'} py-4 text-white`} style={{ backgroundColor: 'rgb(0, 44, 54)' }}>
            {/* <div className="w-full flex justify-center pb-8">
                <div className="h-[3px] bg-black w-full mx-auto px-4" />
            </div> */}
            <div className="hidden md:flex flex-wrap lg:justify-between px-10 justify-start md:gap-20 lg:gap-0 gap-10 max-w-[22rem] md:maxw-[45rem] lg:max-w-[60rem] xl:max-w-6xl mx-auto">
                <div className="flex flex-col gap-2 px-5">
                    <h1 className="font-semibold text-xl my-4">Main Menu</h1>
                    {pages.filter(page => !page?.link?.includes('policy')).map(page => (
                        <Link key={page._id} href={page.url} className="block text-white font-barlow ">
                            {page.title}
                        </Link>
                    ))}
                    <Link href={'/contact'} className="block text-white font-barlow ">Contact</Link>
                </div>

                <div className="flex flex-col gap-2 px-6">
                    <h1 className="font-semibold text-xl my-4">Our Policy</h1>
                    {pages.filter(page => page?.link?.includes('policy')).map(page => (
                        <Link key={page._id} href={page.url} className="block text-white font-barlow">
                            {page.title}
                        </Link>
                    ))}
                    <Link href={'/faq'} className="block text-white font-barlow ">FAQ</Link>
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="font-semibold text-xl flex items-center gap-2 my-4"> More Inquiry</h1>
                    <div className="flex items-center gap-4">
                          <Link href={'tel:+91 8800854549'} className="my-1 gap-2 block rounded-full font-barlow text-white flex items-center">
                        <Phone size={20} className="text-blue-600 " />
                        +91 8800854549
                    </Link>
                    <Link href={'tel:+917060340176'} className="my-1 gap-2 block rounded-full font-barlow text-white flex items-center">
                        Whats' app +91 7060340176 +91 9897515305
                    </Link>
                    </div>
                    <Link href={'mailto:himalayanwellnessretreats@gmail.com'} className="my-1 gap-2 block rounded-full font-barlow text-white flex items-center">
                        <Send className="text-blue-600" size={20} />
                        himalayanwellnessretreats@gmail.com
                    </Link>
                    <p className="my-1 gap-2 font-barlow text-white flex items-center">
                        <MapPin className="text-blue-600" size={20} />
                        Balak Nath Temple Street, Upper Tapovan,
                        <br />
                        Tehri Garhwal Rishikesh,Uttarakhand 249192
                    </p>
                </div>
            </div>
            <div className="md:hidden block grid grid-cols-2 md:grid-cols-3 gap-2 lg:justify-between px-2 justify-start md:gap-20 lg:gap-0 max-w-[30rem] lg:max-w-[60rem] xl:max-w-6xl mx-auto">
                <div className="flex flex-col gap-2 px-2">
                    <h1 className="font-semibold text-xl my-4">Main Menu</h1>
                    {pages.filter(page => !page?.link?.includes('policy')).map(page => (
                        <Link key={page._id} href={page.url} className="block text-white font-barlow ">
                            {page.title}
                        </Link>
                    ))}
                    <Link href={'/contact'} className="block text-white font-barlow ">Contact</Link>
                </div>

                <div className="flex flex-col gap-2 px-2">
                    <h1 className="font-semibold text-xl my-4">Our Policy</h1>
                    {pages.filter(page => page?.link?.includes('policy')).map(page => (
                        <Link key={page._id} href={page.url} className="block text-white font-barlow">
                            {page.title}
                        </Link>
                    ))}
                    <Link href={'/faq'} className="block text-white font-barlow ">FAQ</Link>
                </div>
            </div>
            <div className="md:hidden flex flex-col gap-1 px-5 py-5">
                <h1 className="font-semibold text-xl mb-2 flex items-center gap-2"> More Inquiry</h1>
                <div className="flex items-center gap-4">
                    <Link href={'tel:+91 8800854549'} className="my-1 gap-2 block rounded-full font-barlow text-white flex items-center">
                        <Phone size={20} className="text-blue-600 " />
                        +91 8800854549
                    </Link>
                    <Link href={'tel:+917060340176'} className="my-1 gap-2 block rounded-full font-barlow text-white flex items-center">
                        Whats' app +91 7060340176 +91 9897515305
                    </Link>
                </div>
                <Link href={'mailto:himalayanwellnessretreats@gmail.com'} className="my-1 gap-2 block rounded-full font-barlow text-white flex items-center">
                    <Send className="text-blue-600" size={20} />
                    himalayanwellnessretreats@gmail.com
                </Link>
                <p className="my-1 gap-2 font-barlow text-white flex items-center">
                    <MapPin className="text-blue-600" size={20} />
                    Balak Nath Temple Street, Upper Tapovan,
                    <br />
                    Tehri Garhwal Rishikesh,Uttarakhand 249192
                </p>
            </div>

            {/* Accordance Section */}
            <div className="w-full flex justify-center my-4">
                <div className="md:w-[85%] w-full px-5 md:px-0">
                    <Accordion type="single" collapsible className="bg-[#fff] rounded-md  mb-8">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-black px-6 py-4 text-base ">IMPORTANT NOTICE</AccordionTrigger>
                            <AccordionContent className="text-gray-900 px-6 pb-6 pt-1 text-sm">
                                <strong>Terms &amp; House Rules – Himalayan Wellness Retreats</strong>
                                <br />
                                To ensure a serene, respectful, and fulfilling experience for all guests, we kindly request your adherence to the following terms and house rules:
                                <ul className="list-decimal ml-6 mt-4 space-y-3">
                                    <li>
                                        <strong>Booking &amp; Payment</strong>
                                        <ul className="list-disc ml-5 mt-1">
                                            <li>All bookings must be confirmed with an advance deposit (as per selected package).</li>
                                            <li>The balance amount is payable upon arrival/check-in.</li>
                                            <li>Accepted payment methods: Bank Transfer, UPI, or Cash.</li>
                                            <li>Personal cheques are not accepted.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Cancellation &amp; Rescheduling Policy</strong>
                                        <ul className="list-disc ml-5 mt-1">
                                            <li>Cancellations made 25+ days prior to arrival: <strong>100% refund</strong></li>
                                            <li>Cancellations within 7 to 15 days: <strong>50% refund</strong></li>
                                            <li>Cancellations made less than 7 days before arrival: <strong>Non-refundable</strong></li>
                                            <li>In exceptional cases (e.g., emergencies, natural disruptions), rescheduling may be offered at our discretion.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Check-In &amp; Check-Out</strong>
                                        <ul className="list-disc ml-5 mt-1">
                                            <li>Check-In: 12:00 PM onwards</li>
                                            <li>Check-Out: By 10:00 AM</li>
                                            <li>Early check-in and late check-out are subject to availability and may incur additional charges.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>House Etiquette</strong>
                                        <ul className="list-disc ml-5 mt-1">
                                            <li>This is a wellness-focused, mindful environment. We encourage quietness during yoga, meditation, and evening hours.</li>
                                            <li>Smoking, alcohol, and non-vegetarian food are strictly prohibited on the property.</li>
                                            <li>Respectful behavior towards staff, fellow guests, and retreat space is expected.</li>
                                            <li>Please inform us in advance of any allergies or dietary preferences.</li>
                                            <li>Modest, comfortable clothing is recommended, especially during yoga, spiritual practices, or outdoor excursions.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Health &amp; Safety</strong>
                                        <ul className="list-disc ml-5 mt-1">
                                            <li>Guests are responsible for their own health and well-being. Please disclose any medical conditions at the time of booking.</li>
                                            <li>We practice eco-conscious hospitality—help us conserve water, electricity, and reduce plastic use.</li>
                                            <li>First aid is available onsite; a medical facility is within 15 minutes of the retreat.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Photography &amp; Guest Privacy</strong>
                                        <ul className="list-disc ml-5 mt-1">
                                            <li>Kindly request permission before photographing staff, fellow guests, or sacred ceremonies.</li>
                                            <li>We are committed to your privacy and will not share your personal information without consent.</li>
                                        </ul>
                                    </li>
                                </ul>
                                <br />
                                By confirming your booking with Himalayan Wellness Retreats, you agree to these terms and support our mission to provide a peaceful, safe, and spiritually enriching environment for all.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
            <Card className="my-2 px-2 py-8 max-w-xl lg:max-w-4xl xl:max-w-7xl mx-auto">
                <CardContent className="flex flex-col lg:flex-row items-start justify-between">
                    <div className="text-justify">
                        <Image src="/logo.png" width={200} height={100} alt="footer" />
                        <p className="text-black text-sm lg:w-[40vw] xl:w-[35vw] font-barlow mt-6">
                            <span className="text-xl font-bold py-2">

                                Experience the Essence of Himalayan Wellness
                            </span>
                            <br />
                            Reconnect with yourself in the serene embrace of the Himalayas. Our wellness retreat packages blend daily yoga and meditation, nourishing sattvic meals, and immersive cultural experiences. Enjoy peaceful accommodations with scenic views, guided nature walks, and visits to sacred sites like temples and the Ganga Aarti. Perfect for those seeking inner peace, healing, or a mindful escape — naturally and soulfully.</p>
                    </div>
                    <div className="font-barlow mt-10 lg:mt-0">
                        <h1 className="font-semibold text-xl ">Subscribe to our newsletter</h1>
                        <form onSubmit={handleSubmit} className="mt-4 flex overflow-hidden rounded-lg bg-gray-200">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="border-0 rounded-none focus:ring-0 focus-visible:ring-0 focus:outline-none bg-gray-200"
                            />
                            <button
                                type="submit"
                                className="bg-red-600 text-white text-sm p-2 h-full"
                            >
                                Subscribe
                            </button>
                        </form>


                        <p className="text-black text-sm lg:w-[30vw] xl:w-[20vw]  mt-6">Stay Informed. Stay Ahead.</p>
                        <p className="text-black text-sm lg:w-[30vw] xl:w-[23vw]">Subscribe to our newsletter to get the latest updates.</p>
                    </div>
                </CardContent>
                <CardFooter className="mt-8 flex flex-col items-start md:w-fit">
                    <div className="w-full h-[1px] bg-gray-400" />
                    <div className="flex items-center justify-between font-barlow">
                        <div className="flex flex-col md:flex-row items-start  md:items-center gap-2">
                            <Link href={'/terms-condition'} className="0 !text-sm font-semibold">Terms of Use</Link>
                            <p className="text-gray-900 md:block hidden">|</p>
                            <Link href={'/privacy-policy'} className="0 !text-sm font-semibold">Privacy and Cookies Policy</Link>
                        </div>
                    </div>
                </CardFooter>
            </Card>
            <div className="flex flex-col lg:flex-row items-center justify-center max-w-[25rem] md:max-w-[60rem] xl:max-w-6xl mx-auto font-barlow">
                <p className="text-white font-bold text-center my-4">
                    &copy; <CurrentYear /> <Link href={'/'} className="font-bold text-white">Himalayan Wellness Retreat</Link>. All rights reserved
                </p>
            </div>
        </footer >
    )
}

export default Footer
