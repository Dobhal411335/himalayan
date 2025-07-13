"use client";
import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import Link from "next/link";
import './fonts/fonts.css';
const Banner = () => {
    const [promotinalBanner, setPromotinalBanner] = useState([])
    const [featuredOffer, setFeaturedOffer] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    // console.log(promotinalBanner)
    const fetchPromotinalBanner = async () => {
        try {
            const res = await fetch("/api/addPromotinalBanner");
            const data = await res.json();
            // console.log("Promotinal Banner API response:", data);
            if (data && data.length > 0) {
                setPromotinalBanner(data);
            } else {
                setPromotinalBanner([]);
            }
        } catch (error) {
            // console.error("Error fetching products:", error);
            setPromotinalBanner([]);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchFeaturedOffer = async () => {
        try {
            const res = await fetch("/api/addFeaturedOffer");
            const data = await res.json();
            // console.log("Featured Offer API response:", data);
            if (data && data.length > 0) {
                setFeaturedOffer(data);
            } else {
                setFeaturedOffer([]);
            }
        } catch (error) {
            // console.error("Error fetching products:", error);
            setFeaturedOffer([]);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchPromotinalBanner();
        fetchFeaturedOffer();
    }, [])
    return (
        <div className="bg-[#fcf7f1] w-full overflow-hidden max-w-screen overflow-x-hidden">
            {/* Promotional Banner Section */}
            {promotinalBanner.length > 0 && (
                <div className="w-full py-20 bg-blue-100">
                    <h2 className="pacifico-h2 text-green-800 text-2xl md:text-3xl text-center mb-5 uppercase">
                        <span className="">Our Best Retreats – Reconnect. Realign. Rejuvenate Yourself.
                        </span>
                    </h2>
                    <p className="font-barlow text-gray-600 mb-5 w-[50%] mx-auto text-center">Step away from the noise of daily life and immerse yourself in a retreat designed to nourish your body, mind, and spirit. Whether through guided meditation, yoga by the Ganga, or mindful healing practices, our carefully curated retreats help you reconnect with your inner self, realign your energies, and emerge fully rejuvenated—rested, inspired, and renewed.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
                        {promotinalBanner.map((item, idx) => (
                            <div key={idx} className="flex flex-col h-[300px] md:h-[400px] p-0 overflow-hidden relative group">
                                <Link href={item?.buttonLink || '#'} target="_blank" rel="noopener noreferrer" className="px-10 text-md py-2 bg-black text-white hover:bg-gray-800 transition w-fit"><img src={item.image?.url} alt={item.title} className="absolute inset-0 w-full h-full object-cover object-center opacity-80 transition-transform duration-300 group-hover:scale-105" />
                                </Link>

                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Featured Offer For You Section */}
            {featuredOffer.length > 0 && (
                <div className="w-full my-20 px-2">
                    <h2 className="pacifico-h2 text-green-800 text-2xl md:text-3xl text-center mb-5 uppercase">Balance is the New Luxury – Embrace It Today
                    </h2>
                    <p className="font-barlow text-gray-600 mb-5 w-[50%] mx-auto text-center">Leave the chaos behind and embrace mindful simplicity. Nestled in the calm of Tapovan, our retreats offer expert-led sessions, soulful food, and Himalayan stillness for the ultimate reset.</p>
                    <Carousel className="w-full">
                        <CarouselContent>
                            {featuredOffer.map((item, idx) => (
                                <CarouselItem key={idx} className="md:basis-1/3 lg:basis-1/4">
                                    <div className="flex flex-col h-[300px] p-0 overflow-hidden relative bg-white group">
                                        <Link href={item?.buttonLink || '#'} target="_blank" rel="noopener noreferrer" className="px-10 text-md py-2 bg-black text-white hover:bg-gray-800 transition w-fit"><img src={item.image?.url} alt={item.title} className="absolute inset-0 w-full h-full object-cover object-center opacity-80 transition-transform duration-300 group-hover:scale-105" />
                                        </Link>

                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselNext className="!right-2 !top-1/2 !-translate-y-1/2 z-10 " />
                        <CarouselPrevious className="!left-1 !top-1/2 !-translate-y-1/2 z-10" />
                    </Carousel>
                </div>
            )}
        </div>
    )
}

export default Banner