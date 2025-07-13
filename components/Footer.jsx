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
                toast.success("Thank you for Subscribing!", { style: { borderRadius: "10px", border: "2px solid green" } });
                e.target.reset();
            } else {
                toast.error(data.message || "Subscription failed.", { style: { borderRadius: "10px", border: "2px solid red" } });
            }
        } catch {
            toast.error("An error occurred.", { style: { borderRadius: "10px", border: "2px solid red" } });
        }
    };

    return (
        <footer  className={`print:hidden ${pathName.includes('admin') && 'hidden'}
         ${pathName.includes('artisan') && 'block'} ${pathName.includes('product') && 'block'} ${pathName.includes('customEnquiry') && 'hidden'} ${pathName.includes('checkout') && 'hidden'}  ${pathName.includes('category') && 'block'} py-4 text-white`} style={{backgroundColor: 'rgb(0, 44, 54)'}}>
            {/* <div className="w-full flex justify-center pb-8">
                <div className="h-[3px] bg-black w-full mx-auto px-4" />
            </div> */}
            <div className="flex flex-wrap lg:justify-between px-10 justify-start md:gap-20 lg:gap-0 gap-12 max-w-[22rem] md:maxw-[45rem] lg:max-w-[60rem] xl:max-w-6xl mx-auto">
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

                <div className="flex flex-col gap-1">
                    <h1 className="font-semibold text-xl flex items-center gap-2"> More Inquiry</h1>
                    <Link href={'tel:+917351009107'} className="my-2 gap-2 block rounded-full py-1 font-barlow text-white flex items-center">
                        <Phone size={20} className="text-blue-600 " />
                        +91 9897515305,7060340176
                    </Link>
                    <Link href={'mailto:himalayanwellnessretreats@gmail.com'} className="my-2 gap-2 block rounded-full font-barlow text-white flex items-center">
                        <Send className="text-blue-600" size={20} />
                        himalayanwellnessretreats@gmail.com
                    </Link>
                    <p className="my-2 gap-2 font-barlow text-white mb-5 flex items-center">
                        <MapPin className="text-blue-600" size={20} />
                        Balak Nath Temple Street, Upper Tapovan,
                        <br />
                        Tehri Garhwal Rishikesh,Uttarakhand 249201
                    </p>
                </div>
            </div>
            {/* Accordance Section */}
            <div className="w-full flex justify-center my-4">
                <div className="w-[85%]">
                    <Accordion type="single" collapsible className="bg-[#fff] rounded-md  mb-8">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-black px-6 py-4 text-base ">IMPORTANT NOTICE</AccordionTrigger>
                            <AccordionContent className="text-gray-900 px-6 pb-6 pt-1 text-sm">
                                Terms & House Rules – Himalayan Wellness Retreats
                                To ensure a peaceful and fulfilling experience for all our guests, we kindly request you to read and follow our terms and house rules:
                                <br />

                                1. Booking & Payment :
                                All bookings must be confirmed with a minimum advance deposit (as per package).
                                <br />

                                The remaining balance is payable upon arrival/check-in.

                                We accept payments via bank transfer, UPI, or cash.
                                <br />

                                2. Cancellation Policy
                                
                                Cancellations made 15 days prior to arrival are eligible for a full refund.

                                Cancellations within 7–14 days will receive a 50% refund.

                                No refunds for cancellations made less than 7 days before arrival.

                                In case of emergencies or natural disruptions, we may offer date rescheduling.
                                <br />

                                3. Check-In / Check-Out
                                Check-In: 12:00 PM | Check-Out: 10:00 AM

                                Early check-in or late check-out is subject to availability and additional charges.
                                <br />

                                4. House Rules
                                This is a wellness and mindful living space — silence is appreciated during yoga, meditation, and evening hours.

                                Alcohol, smoking, and non-vegetarian food are strictly prohibited on the retreat premises.

                                Guests are expected to treat the space, staff, and fellow participants with respect and kindness.

                                Please inform us in advance about any allergies or dietary restrictions.

                                Modest and comfortable attire is recommended, especially during spiritual or outdoor activities.
                                <br />

                                5. Health & Safety
                                Guests are responsible for their own health and safety; kindly inform us of any medical conditions at the time of booking.

                                We follow eco-friendly practices — please help us conserve water, electricity, and avoid plastic use.

                                First aid is available on-site; for medical emergencies, the nearest clinic is accessible within 15 minutes.
                                <br />

                                6. Photography & Privacy
                                Kindly seek permission before taking photos of staff, other guests, or during ceremonies.

                                We respect your privacy and will never share your information without consent.

                                By booking with Himalayan Wellness Retreats, you agree to these terms and support our mission to provide a peaceful, nurturing environment for all.</AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>

            <Card className="my-2 px-2 py-8 max-w-xl lg:max-w-4xl xl:max-w-7xl mx-auto">
                <CardContent className="flex flex-col lg:flex-row items-start justify-between">
                    <div className="text-justify">
                        <Image src="/logo.png" width={200} height={100} alt="footer" />
                        <p className="text-black text-sm lg:w-[40vw] xl:w-[35vw] font-barlow mt-6">Experience the Essence of Himalayan Wellness
                            Our wellness retreat packages are thoughtfully designed to rejuvenate your body, mind, and spirit amidst the tranquil beauty of the Himalayas. Each retreat offers a holistic blend of daily yoga and meditation sessions led by experienced instructors, nourishing yogic meals prepared with local, organic ingredients, and immersive experiences that let you explore the simple, soulful lifestyle of the region.

                            Guests enjoy comfortable, serene accommodations with scenic views, nature walks, and guided excursions to nearby temples, waterfalls, and cultural landmarks. Witness the spiritual grandeur of the Ganga Aarti, engage in mindful practices, connect with local artisans, and embrace a slower, more meaningful way of living.

                            Whether you seek inner peace, healing, or just a break from the noise of modern life, our retreats offer a sacred space to reset and reconnect — naturally and soulfully.</p>
                        {/* <p className="text-black text-sm lg:w-[40vw] xl:w-[35vw] font-barlow mt-6">Our website is your gateway to the heart of Rishikesh, offering rich and soulful handmade creations crafted by local artisans.</p> */}
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
