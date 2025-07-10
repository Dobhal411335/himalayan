"use client"
import React, { useState } from 'react';
import { Bed, Phone, ParkingCircle, ShowerHead, Wifi, Tv, Bath, Elevator, Luggage, Coffee, Snowflake, Utensils } from 'lucide-react';

const amenitiesList = [
  { label: 'Restaurant', icon: <Utensils size={32} /> },
  { label: 'Bed', icon: <Bed size={32} /> },
  { label: 'Room Phone', icon: <Phone size={32} /> },
  { label: 'Parking', icon: <ParkingCircle size={32} /> },
  { label: 'Shower', icon: <ShowerHead size={32} /> },
  { label: 'Towel In Room', icon: (
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 16V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10M4 20h16M4 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2M4 20h16" /></svg>
  ) },
  { label: 'Wi-Fi', icon: <Wifi size={32} /> },
  { label: 'Telivision', icon: <Tv size={32} /> },
  { label: 'Bath Tub', icon: <Bath size={32} /> },
  { label: 'Elevator', icon: (
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="6" y="3" width="12" height="18" rx="2" strokeWidth="2"/>
      <path d="M9 9h6M9 13h6M12 16v2" strokeWidth="2"/>
      <path d="M10.5 6l1.5-2 1.5 2" strokeWidth="2"/>
    </svg>
  ) },
  { label: 'Laggage', icon: <Luggage size={32} /> },
  { label: 'Team Maker', icon: <Coffee size={32} /> },
  { label: 'Room AC', icon: <Snowflake size={32} /> },
];

const Amenities = () => {
  const [checked, setChecked] = useState(Array(amenitiesList.length).fill(false));

  const handleCheck = idx => {
    setChecked(prev => prev.map((val, i) => (i === idx ? !val : val)));
  };

  return (
    <div className="min-h-screen bg-[#f7f2eb] flex flex-col items-start px-8 py-4">
      <h1 className="text-3xl font-bold mb-6 ml-8">Rooms Amenities</h1>
      <form className="w-full flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-4 mb-8">
          {amenitiesList.map((item, idx) => (
            <div key={item.label} className="flex items-center justify-between bg-white rounded-lg px-6 py-3 shadow border mb-2">
              <div className="flex items-center gap-4">
                <span>{item.icon}</span>
                <span className="text-xl font-bold">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-6 h-6 accent-[#b6b6b6] border-2 border-gray-400 rounded"
                  checked={checked[idx]}
                  onChange={() => handleCheck(idx)}
                  id={`amenity-${idx}`}
                />
                <label htmlFor={`amenity-${idx}`} className="text-base font-semibold text-gray-600 select-none">Check Box</label>
              </div>
            </div>
          ))}
        </div>
        <button type="submit" className="w-1/2 bg-[#0a360a] text-white text-lg font-bold py-3 rounded shadow hover:bg-green-900 transition">Data Save</button>
      </form>
    </div>
  );
};

export default Amenities;