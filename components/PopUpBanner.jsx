"use client"
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const PopUpBanner = () => {
  const [banner, setBanner] = useState(null);
  const [open, setOpen] = useState(false); // Initially closed
  const [showAnim, setShowAnim] = useState(false);

  useEffect(() => {
    fetch('/api/popupBanner')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBanner(data[0]);
        }
      });
  }, []);

  useEffect(() => {
    if (banner) {
      // Delay popup open by 2 seconds
      const timer = setTimeout(() => {
        setOpen(true);
        // Animate in after open
        setTimeout(() => setShowAnim(true), 10);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [banner]);

  const handleClose = () => {
    setShowAnim(false);
    setTimeout(() => setOpen(false), 200); // Wait for animation out
  };

  if (!banner || !open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 ` transition-opacity duration-300">
      <div
        className={`relative bg-white max-w-3xl w-[85vw] px-5 flex flex-col md:flex-row overflow-hidden transform transition-all duration-500
        ${showAnim ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        style={{ transitionProperty: 'transform, opacity' }}
      >
        {/* Close button top right */}  
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-black/80 hover:bg-black text-white rounded-full p-1 flex items-center justify-center text-2xl font-bold focus:outline-none transition"
          aria-label="Close popup"
        >
          <X size={28} />
        </button>
        {/* Left: Banner image */}
        <div className="md:w-1/2 w-full flex items-center justify-center min-h-[340px]">
          <img
            src={banner.image?.url || '/placeholder.jpeg'}
            alt="Popup Banner"
            className="w-full h-full object-cover"
            style={{ maxHeight: 380, minHeight: 220, objectFit: 'cover' }}
          />
        </div>
        {/* Right: Text content */}
        <div className="md:w-1/2 w-full px-8 py-5 flex flex-col justify-center items-center">
          <div className="mb-4">
            <div className="text-base font-semibold text-center text-gray-500 mb-2">Crafted with Heart</div>
            <div className="text-2xl font-bold mb-4 text-center text-black leading-tight">
              Unwrap the Beauty of Handmade<br />
              <span className="font-normal text-center">– Now on Special Offer!</span>
            </div>
            <div className="text-gray-700 text-base mb-8 max-w-md">
              Discover the beauty of tradition and craftsmanship with our exclusive offer on handcrafted products! Each piece tells a story—made with care, passion, and skill by local artisans.
            </div>
            <a
              href={banner.buttonLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <button
                className="w-full bg-black text-white font-semibold py-2 rounded-none text-lg hover:bg-gray-900 transition"
                style={{letterSpacing: '0.5px'}}
              >
                Explore
              </button>
            </a>
            <div className="text-center w-full text-gray-700 text-base font-semibold mt-2 opacity-80">
              Don’t miss this chance
            </div>
          </div>
        </div>         
        </div>
    </div>
  );
};

export default PopUpBanner;