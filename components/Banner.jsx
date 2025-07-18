"use client";
import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import './fonts/fonts.css';
import FeaturedRoomsSection from "./FeaturedRoomsSection";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import ReviewModal from "./ReviewModal";
import ReviewListModal from "./ReviewListModal";
import BookingDetails from "./BookingDetails";
const Banner = () => {
    const router = useRouter();
    const pathname = usePathname();
    // Modal state for review & booking
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showBookModal, setShowBookModal] = useState(false);

    // Handlers for modals
    const handleShowReviews = (room) => {
        setSelectedRoom(room);
        setShowReviewModal(true);
    };
    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        setSelectedRoom(null);
    };
    const handleCloseBookModal = () => {
        setShowBookModal(false);
        setSelectedRoom(null);
    };
    const [promotinalBanner, setPromotinalBanner] = useState([])
    const [featuredOffer, setFeaturedOffer] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [rooms, setRooms] = useState([]);
    // console.log(rooms)
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

    const fetchRoom = async () => {
        try {
            const res = await fetch("/api/room");
            const data = await res.json();
            if (Array.isArray(data)) {
                setRooms(data);
            } else if (Array.isArray(data.rooms)) {
                setRooms(data.rooms);
            } else {
                setRooms([]);
            }
        } catch (error) {
            setRooms([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotinalBanner();
        fetchFeaturedOffer();
        fetchRoom();
    }, [])
    return (
        <div className="bg-[#fcf7f1] w-full overflow-hidden max-w-screen overflow-x-hidden">

            {/* Promotional Banner Section */}
            {promotinalBanner.length > 0 && (
                <div className="w-full  py-10 md:py-20 bg-[#ededed]">
                    <h2 className="pacifico-h2 px-10 text-green-800 text-xl md:text-2xl text-center mb-5 uppercase">
                        <span className="">Our Best Retreats – Reconnect. Realign. Rejuvenate Yourself.
                        </span>
                    </h2>
                    <p className="font-barlow text-gray-600 mb-5 w-[80%] md:w-[50%] mx-auto text-center">Step away from the noise of daily life and immerse yourself in a retreat designed to nourish your body, mind, and spirit. Whether through guided meditation, yoga by the Ganga, or mindful healing practices, our carefully curated retreats help you reconnect with your inner self, realign your energies, and emerge fully rejuvenated—rested, inspired, and renewed.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 px-2">
                        {promotinalBanner.map((item, idx) => (
                            <div key={idx} className="flex flex-col h-[220px] md:h-[450px] p-0 overflow-hidden relative group">
                                <Link href={item?.buttonLink || '#'} target="_blank" rel="noopener noreferrer" ><img src={item.image?.url} alt={item.title} className="absolute inset-0 w-full h-full md:object-cover object-contain object-center transition-transform duration-300 group-hover:scale-105" /></Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Featured Offer For You Section */}
            {featuredOffer.length > 0 && (
                <div className="w-full md:my-20 py-10 px-2">
                    <h2 className="pacifico-h2 text-green-800 px-10 text-xl md:text-3xl text-center mb-5 uppercase">Balance is the New Luxury – Embrace It Today
                    </h2>
                    <p className="font-barlow text-gray-600 mb-5 w-[80%] md:w-[50%] mx-auto text-center">Leave the chaos behind and embrace mindful simplicity. Nestled in the calm of Tapovan, our retreats offer expert-led sessions, soulful food, and Himalayan stillness for the ultimate reset.</p>
                    <Carousel className="w-full">
                        <CarouselContent>
                            {featuredOffer.map((item, idx) => (
                                <CarouselItem key={idx} className="md:basis-1/3 lg:basis-1/4">
                                    <div className="flex flex-col h-[350px] p-0 overflow-hidden relative group">
                                        <Link href={item?.buttonLink || '#'} target="_blank" rel="noopener noreferrer"><img src={item.image?.url} alt={item.title} className="absolute inset-0 w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105" /></Link>

                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselNext className="!right-2 !top-1/2 !-translate-y-1/2 z-10 " />
                        <CarouselPrevious className="!left-1 !top-1/2 !-translate-y-1/2 z-10" />
                    </Carousel>
                </div>
            )}
            {rooms.length > 0 && (
                <>
                    <div className="bg-[#ededed] flex flex-col md:items-center md:justify-between p-6 rounded-lg md:mb-8 mb-4">
                        <div className="">
                            <div className="flex flex-col md:flex-row justify-between gap-2">

                                <h2 className="pacifico-h2 uppercase text-green-800 text-xl md:text-3xl text-center my-5 px-2">Comfort Meets Calm – Your Ideal Stay Awaits</h2>
                                <div className="md:my-auto md:px-10 p-2 flex justify-end">
                                    <Link href={"/accommodation"} className="p-3 bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 text-md shadow-lg transition-all duration-200">
                                        View All Room
                                    </Link>
                                </div>
                            </div>
                            <p className="text-base md:text-md leading-snug mt-2">
                                Our accommodation offers the perfect blend of comfort, serenity, and functionality—making it an ideal stay for all kinds of travelers, whether solo, with family, or in a group. Each room is thoughtfully designed with elegant interiors, cozy bedding, and large windows that open to serene natural views. We provide all modern amenities including high-speed Wi-Fi, air conditioning, 24/7 hot water, in-room tea/coffee makers, spacious bathrooms, and secure locker facilities. Daily housekeeping ensures a clean and welcoming environment throughout your stay. With easy access to yoga halls, meditation spaces, and common lounges, our stay is more than just a room—it’s a peaceful retreat that truly feels like home.
                            </p>
                        </div>
                        <FeaturedRoomsSection
                            rooms={rooms}
                            onShowReviews={handleShowReviews}
                        />

                    </div>
                </>
            )}
            {/* Render ReviewModal and BookingDetails for selected room */}
            {showReviewModal && selectedRoom && (
                <ReviewListModal
                    open={showReviewModal}
                    onClose={handleCloseReviewModal}
                    reviews={selectedRoom.reviews || []}
                />
            )}
        </div>
    )
}

export default Banner