import connectDB from "@/lib/connectDB";
import MenuBar from "@/models/MenuBar";
import { NextResponse } from "next/server";
import Artisan from "@/models/Artisan"
import Packages from "@/models/Packages"
import Size from '@/models/Size';
import Color from '@/models/Color';
import Gallery from '@/models/Gallery';
import Video from '@/models/Video';
import Description from '@/models/Description';
import Info from '@/models/Info';
import CategoryTag from '@/models/CategoryTag';
import ProductReview from '@/models/ProductReview';
import Quantity from '@/models/Quantity';
import ProductCoupons from '@/models/ProductCoupons';
import ProductTax from '@/models/ProductTax';
export async function GET(req) {
    await connectDB();
    const menu = await MenuBar.find({})
        .populate({
            path: 'subMenu.packages',
            populate: [
                { path: 'artisan' },
                { path: 'price' },
                { path: 'gallery' },
                { path: 'video' },
                { path: 'description' },
                { path: 'info' },
                { path: 'categoryTag' },
                { path: 'reviews' },
                { path: 'quantity' },
                { path: 'coupons' },
                { path: 'taxes' }
            ]
        })
        .sort({ order: 1 });
    return NextResponse.json(menu);
}