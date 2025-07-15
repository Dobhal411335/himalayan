"use client";
import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bed,
  Phone,
  ParkingCircle,
  ShowerHead,
  Wifi,
  Tv,
  Bath,
  Luggage,
  Coffee,
  Snowflake,
  Utensils,
} from "lucide-react";

// Amenity icons mapping (copied from ArtisanList)
const amenityIcons = {
  Restaurant: <Utensils size={18} />,
  Bed: <Bed size={18} />,
  "Room Phone": <Phone size={18} />,
  Parking: <ParkingCircle size={18} />,
  Shower: <ShowerHead size={18} />,
  "Towel In Room": (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 16V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10M4 20h16M4 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2M4 20h16"
      />
    </svg>
  ),
  "Wi-Fi": <Wifi size={18} />,
  Television: <Tv size={18} />,
  "Bath Tub": <Bath size={18} />,
  Elevator: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="6" y="3" width="12" height="18" rx="2" strokeWidth="2" />
      <path d="M9 9h6M9 13h6M12 16v2" strokeWidth="2" />
      <path d="M10.5 6l1.5-2 1.5 2" strokeWidth="2" />
    </svg>
  ),
  Laggage: <Luggage size={18} />,
  "Tea Maker": <Coffee size={18} />,
  "Room AC": <Snowflake size={18} />,
};

export default function RoomsAccommodation({ rooms = [] }) {
  if (!rooms || rooms.length === 0) {
    return <div className="text-center py-8 text-lg text-gray-600">No rooms found.</div>;
  }

  return (
    <div className="w-full my-8 px-5">
      <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-4 text-start px-10">Accommodation Options</h2>
      <Carousel className="w-full ">
        <CarouselContent className="w-full gap-6">
          {rooms.map((room, idx) => {
            // Collect all image URLs
            const imageUrls = [
              ...(room.mainPhoto?.url ? [room.mainPhoto.url] : []),
              ...(room.relatedPhotos?.length ? room.relatedPhotos.map(photo => photo.url) : [])
            ];
            if (imageUrls.length === 0) imageUrls.push('/placeholder.jpeg');
            // Price logic (show for 2 Pax or 1 Pax)
            const priceList = (room.prices && room.prices[0] && room.prices[0].prices) || [];
            const mainPrice = priceList.find(p => p.type === '02 Pax') || priceList.find(p => p.type === '01 Pax');
            return (
              <CarouselItem
                key={room._id || idx}
                className="md:basis-1/2 lg:basis-1/2 min-w-0 snap-start"
              >
                <Card className="bg-[#f8f5ef] rounded-2xl px-2 py-1 my-2 border border-gray-200 flex flex-col md:flex-row gap-2 items-stretch">
                  <div className="relative w-full md:w-[320px] h-full flex-shrink-0 flex items-stretch overflow-hidden">
                    <Carousel className="w-full h-full" opts={{ loop: true }}>
                      <CarouselContent>
                        {imageUrls.map((img, i) => (
                          <CarouselItem key={i} className="w-full h-full flex items-center justify-center">
                            <Image
                              src={img}
                              alt={room.title || 'Room'}
                              width={400}
                              height={400}
                              className="object-cover w-full h-full rounded-xl"
                              priority={i === 0}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2" />
                      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2" />
                    </Carousel>
                  </div>
                  <CardContent className="flex-1 p-4 flex flex-col gap-2 justify-between min-h-[260px] relative">
                    <div className="flex items-start justify-between">
                      <h3 className="text-md font-bold text-gray-900">{room.title || "Room Name"}</h3>
                      <div className="flex flex-col items-center gap-1">
                        <div>

                        {[...Array(Math.round((room.reviews?.[0]?.rating || 5)))].map((_, i) => (
                          <span key={i} className="inline-block"><svg width="16" height="16" viewBox="0 0 24 24" fill="#12b76a" stroke="#12b76a"><polygon points="12,2 15,9 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,9" /></svg></span>
                        ))}
                        </div>
                        <span className="text-xs text-gray-700 ml-1">
                          {room.reviews?.length || 0} Review{(room.reviews?.length || 0) !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-800 text-sm">
                      {(() => {
                        const text = (room.paragraph || '').replace(/<[^>]+>/g, '');
                        const words = text.split(' ');
                        if (words.length > 10) {
                          return words.slice(0, 10).join(' ') + '...';
                        }
                        return text;
                      })()}
                    </div>
                    <div className="font-semibold text-gray-800 text-sm mt-1">Room Amenities</div>
                    <div className="flex gap-2 mb-1 text-lg flex-wrap">
                      <TooltipProvider>
                        {(room.amenities || []).map((am, i) => (
                          <Tooltip key={am._id || i}>
                            <TooltipTrigger asChild>
                              <span className="bg-gray-100 px-1 rounded flex items-center justify-center cursor-pointer">
                                {amenityIcons[am.label] || am.label}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top">{am.label}</TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>
                    </div>
                    <div className="flex gap-8 text-xs">
                      <span>
                        Max occupancy: {
                          priceList.some(p => p.type === '02 Pax')
                            ? '02 Pax'
                            : priceList.some(p => p.type === '01 Pax')
                              ? '01 Pax'
                              : 'N/A'
                        }
                      </span>
                      <span>
                        Extra bed available: {
                          priceList.some(p => p.type === 'Extra Bed') ? 'Yes' : 'No'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-black">Rs. {mainPrice ? mainPrice.amount : 'N/A'}</span>
                        {mainPrice && mainPrice.oldPrice && (
                          <span className="text-lg font-semibold text-gray-400 line-through">Rs. {mainPrice.oldPrice}</span>
                        )}
                      </div>
                      <button
                        className="bg-green-700 hover:bg-green-900 text-white font-bold py-1 px-4 rounded-xl shadow transition-all text-lg"
                        onClick={() => alert('Booking coming soon!')}
                      >
                        Book Now
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {/* <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 p-5" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 p-5" /> */}
      </Carousel>
    </div>
  );
}