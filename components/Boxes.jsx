import React from 'react'
import { Gift, ShoppingCart, BadgePercent, ShieldCheck } from 'lucide-react';

const Boxes = () => {
  return (

        
    <div className="w-full px-2">
    {/* Promo Bar - Top */}
    <div className="w-full bg-[#F9EDE1] border-b border-neutral-200 my-3">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto py-4 px-2 gap-5">
        <div className="flex-1 flex flex-col items-center md:items-start">
          <span className="font-bold text-lg md:text-2xl">Reclaim Your Peace</span>
          <span className="text-md text-gray-900">Breathe. Heal. Awaken — In Rishikesh’s Sacred Serenity.</span>
        </div>
        <div className="hidden md:block w-[1px] h-8 bg-black mx-6"></div>
        <div className="flex-1 flex flex-col items-center md:items-end">
          <span className="font-bold text-lg md:text-2xl">Retreat to Rishikesh</span>
          <span className="text-md text-gray-900">Unplug from the World, Reconnect with Your Soul.</span>
        </div>
      </div>
    </div>
    {/* Feature Icons Row */}
    <div className="w-full bg-gray-200 mb-2">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between max-w-7xl mx-auto py-4 px-2 gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-[120px]">
          <span className="text-xl"><Gift size={25} /></span>
          <span className="font-bold text-xs md:text-lg uppercase">Revitalizing Sessions</span>
        </div>
        <div className="hidden md:block w-[1px] h-6 bg-black"></div>
        <div className="flex items-center gap-2 flex-1 min-w-[120px]">
          <span className="text-xl"><ShoppingCart size={25} /></span>
          <span className="font-bold text-xs md:text-lg uppercase">Easy, Quick & Friendly</span>
        </div>
        <div className="hidden md:block w-[1px] h-6 bg-black"></div>
        <div className="flex items-center gap-2 flex-1 min-w-[120px]">
          <span className="text-xl"><BadgePercent size={25} /></span>
          <span className="font-bold text-xs md:text-lg uppercase">We’re Quick. Effortless </span>
        </div>
        <div className="hidden md:block w-[1px] h-6 bg-black"></div>
        <div className="flex items-center gap-2 flex-1 min-w-[120px]">
          <span className="text-xl"><ShieldCheck size={25} /></span>
          <span className="font-bold text-xs md:text-lg uppercase">Trusted & Secure Checkout</span>
        </div>
      </div>
    </div>
  </div>


  )
}

export default Boxes