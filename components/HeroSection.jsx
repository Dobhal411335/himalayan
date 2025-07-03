"use client";
import { useState, useEffect, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import toast from "react-hot-toast";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/context/SearchContext";
import { CalendarClock, MapPin, Search, Sparkle, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";

const HeroSection = () => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [api, setApi] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  const dummyBanners = [
    {
      title: "Welcome",
      subTitle: "Explore Our Collection",
      image: { url: "https://dummyimage.com/1280x720/000/fff" },
      link: "/"
    },
    {
      title: "Discover",
      subTitle: "Find Amazing Deals",
      image: { url: "https://dummyimage.com/1280x720/333/fff" },
      link: "/products"
    },
    {
      title: "Shop Now",
      subTitle: "Limited Time Offers",
      image: { url: "https://dummyimage.com/1280x720/666/fff" },
      link: "/offers"
    },
  ];

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("/api/addBanner");
        const data = await response.json();
        setBanners(data.length ? data : dummyBanners);
      } catch (error) {
        toast.error("Failed to fetch banners");
        setBanners(dummyBanners);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect(); // Set initial selectedIndex

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Sync carousel to selectedIndex when it changes (for pagination dots)
  useEffect(() => {
    if (api && typeof api.scrollTo === "function") {
      api.scrollTo(selectedIndex);
    }
  }, [selectedIndex, api]);

  const { isSearchOpen, setIsSearchOpen } = useSearch();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  if (isLoading) {
    return (
      <section className="relative xl:h-screen w-full overflow-hidden z-[160]">
        <Carousel className="h-full w-full" plugins={[plugin.current]} onMouseLeave={plugin.current.reset}>
          <CarouselContent className="h-full">
            {[...Array(4)].map((_, index) => (
              <CarouselItem key={index} className="h-[100vh] md:h-full">
                <div className="relative h-full w-full">
                  <Skeleton className="h-[100vh] w-full" />
                  <div className="absolute translate-y-1/2 top-1/3 translate-x-1/2 right-1/2 z-20 w-full">
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                  </div>
                  <div className="absolute translate-y-1/2 bottom-1/2 translate-x-1/2 right-1/2 z-20 w-full">
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    );
  }

  return (
    <section className="bg-[#fcf7f1] relative xl:h-screen h-full w-full px-2 overflow-hidden z-0 group">
      <div className="hidden xl:block w-full h-screen ">
        <div className="hidden xl:block w-full h-full">
          <Carousel
            className="h-full w-full"
            plugins={[plugin.current]}
            onMouseLeave={plugin.current.reset}
            setApi={setApi}
          >
            <CarouselContent className="h-full">
              {banners.map((item, index) => (
                <CarouselItem key={index} className="h-[100vh] md:h-full">
                  <Link href={item?.buttonLink || "#"} className="block h-full w-full">
                  <div className="relative h-[100vh] w-full flex items-center justify-center">
                      <Image
                        src={item?.frontImg?.url || "/fallback.jpg"}
                        alt={item?.title || "Banner Image"}
                        fill
                        quality={100}
                        priority
                        className="object-cover"
                      />
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrows */}
            <CarouselPrevious className="left-4 md:left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CarouselNext className="right-4 md:right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Carousel>

          {/* Custom Pagination Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === selectedIndex ? "bg-white w-6" : "bg-white/50"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </div>

      <div className="block xl:hidden w-full h-full pt-4 pb-12 relative max-h-[90vh]">
        {/* Mobile Carousel: Only show first image, center content over image, add to cart above image */}
        <Carousel className="w-full max-w-md mx-auto" plugins={[plugin.current]} onMouseLeave={plugin.current.reset} setApi={setApi} >
          <CarouselContent>
            {banners.map((banner, index) => (
              <CarouselItem key={index} className="flex flex-col items-center justify-center relative">
                <div className="relative w-full flex flex-col items-center">
                  {/* Centered Content above image */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center w-full px-2 pb-6">
                    <h1 className="text-2xl font-bold text-white drop-shadow mb-2 text-center px-2">
                      {banner.title || "No Title"}
                    </h1>
                    <div className="text-lg font-semibold text-white mb-1">Price</div>
                    <div className="text-2xl font-extrabold text-white mb-2 flex flex-row items-center gap-2">
                      {(() => {
                        const priceNum = Number((banner.price || '').replace(/[^\d.]/g, ''));
                        let discounted = priceNum;
                        let hasDiscount = false;
                        if (!isNaN(priceNum) && priceNum > 0) {
                          if (banner.couponAmount && !isNaN(Number(banner.couponAmount)) && Number(banner.couponAmount) > 0) {
                            discounted = priceNum - Number(banner.couponAmount);
                            hasDiscount = true;
                          } else if (banner.couponPercent && !isNaN(Number(banner.couponPercent)) && Number(banner.couponPercent) > 0) {
                            discounted = priceNum - (priceNum * Number(banner.couponPercent)) / 100;
                            hasDiscount = true;
                          }
                        }
                        if (hasDiscount && discounted < priceNum) {
                          return (
                            <span>
                              <del className="text-white font-bold text-2xl mr-2">₹{priceNum.toLocaleString()}</del>
                              <span className="font-bold text-2xl text-white px-2">₹{Math.round(discounted)}</span>
                            </span>
                          );
                        } else {
                          return (
                            <span className="font-bold text-2xl text-white">₹{priceNum ? priceNum.toLocaleString() : "0.00"}</span>
                          );
                        }
                      })()}
                    </div>
                    <div className="flex gap-3 mb-3 justify-center">
                      <button
                        onClick={async () => {
                          if (!banner.addtoCartLink) return;
                          setLoading(true);
                          try {
                            const productId = banner.addtoCartLink.split('/').pop();
                            const response = await fetch(`/api/product/${productId}`);
                            if (!response.ok) throw new Error('Failed to fetch product');
                            const product = await response.json();
                            let price = product.quantity?.variants?.[0]?.price || 0;
                            if (!price) {
                              const variantWithPrice = product.quantity?.variants?.find(v => v.price);
                              price = variantWithPrice?.price || 0;
                            }
                            let discountedPrice = price;
                            let couponApplied = false;
                            let couponCode;
                            if (banner.coupon) {
                              if (typeof banner.coupon.percent === 'number' && banner.coupon.percent > 0) {
                                discountedPrice = price - (price * banner.coupon.percent) / 100;
                                couponApplied = true;
                                couponCode = banner.coupon.couponCode;
                              } else if (typeof banner.coupon.amount === 'number' && banner.coupon.amount > 0) {
                                discountedPrice = price - banner.coupon.amount;
                                couponApplied = true;
                                couponCode = banner.coupon.couponCode;
                              }
                            }
                            addToCart({
                              id: product._id,
                              name: product.title,
                              image: product?.gallery?.mainImage || "/placeholder.jpeg",
                              price: Math.round(discountedPrice),
                              originalPrice: price,
                              qty: 1,
                              couponApplied,
                              couponCode: couponApplied ? couponCode : undefined,
                              productCode: product.code || product.productCode || '',
                              discountPercent: banner.coupon && typeof banner.coupon.percent === 'number' ? banner.coupon.percent : undefined,
                              discountAmount: banner.coupon && typeof banner.coupon.amount === 'number' ? banner.coupon.amount : undefined,
                              cgst: (product.taxes && product.taxes.cgst) || product.cgst || (product.tax && product.tax.cgst) || 0,
                              sgst: (product.taxes && product.taxes.sgst) || product.sgst || (product.tax && product.tax.sgst) || 0,
                              quantity: 1,
                            });
                            toast.success('Product added to cart!');
                          } catch (error) {
                            toast.error('Failed to add product to cart');
                            console.error('Add to cart error:', error);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={!banner.addtoCartLink}
                        className={`bg-white text-black px-5 py-2 font-bold mb-2 ${!banner.addtoCartLink ? ' opacity-50 cursor-not-allowed' : ''}`}
                      >
                        ADD TO CART
                      </button>
                      <a
                        href={banner.viewDetailLink || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`bg-white text-black px-5 py-2 font-bold mb-2 ${!banner.viewDetailLink ? ' opacity-50 pointer-events-none' : ''}`}
                      >
                        VIEW DETAIL
                      </a>
                    </div>
                    <div className="flex flex-col items-center gap-1 mt-1 mb-2">
                      <div className="text-base font-bold text-white">{banner.subtitle || "No Subtitle"}</div>
                      {/* <div className="text-sm font-semibold text-white tracking-tight px-4 text-center">{banner.subDescription || "No Sub Description"}</div> */}
                    </div>
                  </div>
                  {/* Front Image only for mobile */}
                  <img
                    src={banner.frontImg?.url || "/placeholder.jpg"}
                    alt={banner.title ? `${banner.title} Front` : "Front"}
                    className="object-cover w-full max-h-[60vh] rounded-lg shadow-lg z-0"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-4">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === selectedIndex ? "bg-black w-6" : "bg-black/30"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </div>

    </section>
  );
};

export default HeroSection;