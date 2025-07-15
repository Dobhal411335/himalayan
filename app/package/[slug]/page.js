// import Packages from "@/components/Packages";

// export default async function PackagePage({ params }) {
//     const { slug } = await params;
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/add_package/by_slug/${encodeURIComponent(slug)}`);
//     const packageData = await res.json();
//     if (!packageData || packageData.error) return <div>Page Not found</div>;
//     return <Packages data={packageData} />;
// }

// 👇 Add this at the top to force server-side rendering
export const dynamic = "force-dynamic";

import { SidebarInset } from "@/components/ui/sidebar";
import ResponsiveFeaturedCarousel from "@/components/ResponsiveFeaturedCarousel";

import { CategoryCarousel } from "@/components/Category/category-card";
import connectDB from "@/lib/connectDB";
import Packages from "@/models/Packages";
import RoomsAccommodation from "@/components/RoomsAccommodation";
import ProductDetailView from "@/components/ProductDetailView";
import ProductVideo from "@/components/ProductVideo";
import ProductInfoTabs from "@/components/ProductInfoTabs";
import StickyAddToCartBar from "@/components/StickyAddToCartBar";
import Gallery from '@/models/Gallery';
import Video from '@/models/Video';
import Description from '@/models/Description';
import Info from '@/models/Info';
import CategoryTag from '@/models/CategoryTag';
import ProductReview from '@/models/ProductReview';
import ProductTax from '@/models/ProductTax';
const PackagePage = async ({ params }) => {
    await connectDB();

    const { slug } = params;
    const decodedSlug = decodeURIComponent(slug);
    const rawProduct = await Packages.findOne({ slug: decodedSlug })
        .populate('gallery video description info categoryTag reviews taxes')
        .lean();

    // ✅ Convert to plain JSON
    const product = JSON.parse(JSON.stringify(rawProduct));

    if (!product || !product.active) {
        return (
            <div className="text-center py-10">
                <h1 className="text-2xl font-bold mb-2">Package Not Available</h1>
                <p>This package may be disabled or removed by admin.</p>
            </div>
        );
    }

    // ✅ Fetch Categories
    let allCategories = [];
    try {
        if (product.category) {
            const allCategoriesRes = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/getAllMenuItems`,
                { cache: 'no-store' }
            );
            if (!allCategoriesRes.ok) throw new Error("Categories fetch failed");
            allCategories = await allCategoriesRes.json();
        }
    } catch (error) {
        console.error("Error fetching categories:", error.message);
    }
    
    // ✅ Frequently Bought Together
    let rooms = [];
    try {
        const roomRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/room`,
            { cache: 'no-store' }
        );
        if (roomRes.ok) {
            const data = await roomRes.json();
            rooms = Array.isArray(data)
                ? data
                : (Array.isArray(data.rooms) ? data.rooms : []);
        }
        console.log(rooms)
    } catch (error) {
        console.error("Error fetching rooms:", error.message);
    }

    // ✅ Render Product Detail Page
    return (
        <SidebarInset>
            <div className="w-full py-8 flex flex-col">
                <div className="space-y-4 px-4">
                    {/* ✅ Force rerender when navigating between products */}
                    <ProductDetailView key={product._id} product={product} />
                </div>
                <div className="space-y-4">
                    <ProductVideo product={product} />
                </div>
                <div className="space-y-4">
                    <ProductInfoTabs product={product} />
                </div>
                <div className="space-y-4">
                    <RoomsAccommodation rooms={rooms} />
                </div>

                {/* {frequentlyBoughtTogether.length > 0 && (
                    <div className="mt-8 px-4 py-10 bg-blue-100">
                        <h2 className="text-2xl md:text-3xl font-semibold px-10">Frequently Bought Together</h2>
                        <ResponsiveFeaturedCarousel products={frequentlyBoughtTogether} />
                    </div>
                )} */}
                {/* 

                {/* <StickyAddToCartBar product={product} /> */}
            </div>
        </SidebarInset>
    );
};

export default PackagePage;
