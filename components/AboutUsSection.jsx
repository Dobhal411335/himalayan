"use client";

import { ChevronsLeft, ChevronsRight, MapPinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import './fonts/fonts.css';
const AboutUsSection = () => {
    const [featuredPackages, setFeaturedPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const dummyPackages = [
        {
            _id: "1",
            link: "#",
            image: { url: "https://dummyimage.com/1280x720/000/fff" },
            headerText: "Spiritual Retreat",
            title: "Himalayan Pilgrimage",
            subTitle: "Find peace in the mountains",
            location: "Uttarakhand, India",
            footertext: "A journey to rejuvenate your soul",
        },
    ];

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch('/api/featured-packages');
                const data = await response.json();
                // console.log(data);
                setFeaturedPackages(data?.length ? data : dummyPackages); // Use dummy data if API returns empty
            } catch (error) {
                // console.error('Error fetching data:', error);
                setFeaturedPackages(dummyPackages); // Use dummy data on error
            } finally {
                setIsLoading(false);
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    if (isLoading) {
        return (
            <section className="bg-[#fcf7f1] py-14 md:py-36 xl:py-20">
                <div className="relative">
                    <img className="absolute -top-32 left-0 -z-10 lg:scale-[2]" src="/bg-shape.png" alt="background gradient shape" />
                </div>
                <div className="max-w-[22rem] md:max-w-[45rem] lg:max-w-[60rem] xl:max-w-7xl mx-auto">
                    <h2 className="font-bold text-2xl md:text-4xl">
                        <Skeleton className="w-3/4 h-8" />
                    </h2>
                    <div className="text-gray-600 py-8 text-justify font-barlow">
                        <Skeleton className="w-full h-24" />
                    </div>
                    <h4 className="flex items-center text-gray-600 font-barlow font-bold text-sm md:text-lg xl:text-xl mb-4">
                        <Skeleton className="w-10 h-6" />
                        <Skeleton className="w-32 h-6" />
                        <Skeleton className="w-10 h-6" />
                    </h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="rounded-2xl group flex flex-col justify-between relative overflow-hidden w-full h-96 p-8">
                                {/* Skeleton for image */}
                                <Skeleton className="w-full h-96 rounded-2xl" />
                                <div className="bg-gradient-to-r from-black/80 via-black/30 to-transparent absolute inset-0"></div>
                                <div className="z-10">
                                    <Skeleton className="w-3/4 h-8 bg-white" />
                                    <Skeleton className="w-2/3 h-6 bg-white mt-2" />
                                    <Skeleton className="w-1/2 h-6 bg-white mt-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        );
    }
    return (
        <section className="bg-[#f8f9f6] relative py-10 w-full px-10 md:px-5 overflow-hidden max-w-screen overflow-x-hidden">
            <div className="w-full">
                <h2 className="pacifico-h2 text-green-800 text-3xl text-center mt-2 md:mt-7 uppercase">
                    <span className="">Experience the Soul of Himalayan Wellness in Rishikesh,</span>
                </h2>
                <p className=" text-xl font-lg md:text-xl text-center mt-2">
                    emphasizes uniqueness, tradition, artistry, and authentic
                </p>
                <hr className="h-[2px] w-[50%] mx-auto bg-black" />

                <p className="text-gray-600 md:py-8 py-4 text-center font-barlow md:w-[50%] w-full mx-auto">
                    Experience the Soul of Himalayan Wellness in Rishikesh
                    Himalayan Wellness Retreats invites you to a transformative journey nestled in the spiritual heartland of Tapovan, Rishikesh — where the charm of the sacred city meets the serene rhythm of the Ganges. Known as the Yoga Capital of the World, Rishikesh offers the perfect backdrop for inner healing, mindful living, and soulful exploration.

                    Our thoughtfully curated retreats are designed to rejuvenate your body, mind, and spirit amidst the majestic Himalayan landscape. Each day begins with revitalizing yoga and meditation sessions led by experienced instructors, followed by nourishing yogic meals prepared from fresh, organic ingredients.

                    Immerse yourself in the local lifestyle as you explore ancient temples, vibrant artisan markets, and the awe-inspiring Ganga Aarti — all just steps away from our peaceful retreat in Tapovan. Guests enjoy serene accommodations with stunning views, nature walks, and spiritual excursions that connect you deeply with the essence of the region.

                    Whether you seek inner peace, spiritual growth, or simply a conscious escape, Himalayan Wellness Retreats in Rishikesh offers a sacred space to reconnect—with yourself, with nature, and with the divine flow of life.

                    Explore the Spirit of Rishikesh — Where Every Breath is a Step Toward Wholeness.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto">
                    {loading ? (
                        // Loading skeletons
                        Array.from({ length: 5 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center w-52 rounded-3xl animate-pulse"
                                style={{ padding: "1rem 0 0.5rem 0" }}
                            >
                                <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden flex items-end justify-center bg-gray-200" />
                                <div className="mt-4 text-center px-2 w-full flex justify-start">
                                    <span className="block h-6 w-32 rounded bg-gray-200" />
                                </div>
                            </div>
                        ))
                    ) : (
                        featuredPackages.map((item) => (
                            <div
                                key={item._id}
                                className="flex flex-col items-center w-42 mx-auto md:w-80 rounded-3xl group"
                                style={{ padding: "1rem 0 0.5rem 0" }}
                            >
                                <div className="w-full aspect-[4/5] rounded-2xl border overflow-hidden flex items-end justify-center">
                                    <img
                                        src={item.image.url}
                                        alt={item.title}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="mt-4 text-center px-2 w-full flex justify-start">
                                    <Link key={item._id} href={item.link}>
                                        <div className="font-bold text-sm md:text-xl text-black hover:underline transition cursor-pointer">{item.title}</div>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default AboutUsSection;
