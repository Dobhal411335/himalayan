"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import React from 'react'
import './fonts/fonts.css';
const accordionData = [
  {
    title: "What Sets Us Apart:",
    content: "We are committed to curating authentic, soul-nourishing wellness experiences that spark personal transformation and holistic healing.Through a thoughtfully crafted blend of yoga, meditation, Ayurvedic therapies, and nature-based healing, we create immersive retreats that go beyond relaxation—they awaken self-awareness, restore balance, and promote long-term well-being.\n\nOur programmes are grounded in the rich spiritual and cultural heritage of Rishikesh, and guided by experienced practitioners who honor ancient traditions while adapting to individual needs.\n\nWe incorporate local wisdom, sustainable practices, and community involvement, ensuring that our retreats not only serve our guests, but also uplift the environment and local livelihoods.By connecting people back to the rhythms of nature and inner stillness, we inspire a way of life rooted in mindfulness, compassion, and sustainability—helping individuals return home with tools for lasting wellness, and a deeper connection to themselves and the world around them."
  },
  {
    title: "Yoga & Meditation",
    content: "Daily yoga sessions are at the heart of our retreats. Led by experienced and certified instructors, our classes blend Hatha, Ashtanga, and restorative yoga, paired with guided meditation and pranayama (breathwork) to enhance inner calm, flexibility, and focus.\n\n• Morning & evening yoga sessions\n• Meditation for stress release and mental clarity\n• Special focus on alignment, breath, and mindfulness"
  },
  {
    title: "Ayurvedic Therapies",
    content: "We incorporate ancient Ayurvedic healing practices to rejuvenate the body and restore balance. Our therapies are tailored to your dosha (body constitution) and health goals.\n\n• Abhyanga (full body oil massage)\n• Shirodhara (oil stream therapy for mental peace)\n• Herbal detox and wellness consultations"
  },
  {
    title: "Nature Walks & Himalayan Trails",
    content: "Surrounded by the sacred Ganga and lush green hills, our nature-based experiences reconnect you with the earth.\n\n• Peaceful morning nature walks\n• Sunset hikes\n• Ganga-side meditations\n\nThese activities foster deep reflection and emotional release."
  },
  {
    title: "Accommodation for Yogic Lifestyle",
    content: "Our retreat offers serene and comfortable accommodation options, designed to support a simple, sattvic (pure) lifestyle. Rooms are clean, minimal, and infused with natural elements to encourage restful sleep and peace of mind.\n\n• Private & shared rooms with attached bath\n• Yogic vegetarian meals (sattvic food)\n• Peaceful ambiance for digital detox"
  },
  {
    title: "Wellness Retreat Packages",
    content: "We offer flexible retreat durations to suit your availability and wellness goals:\n\n• 3-Day Introductory Retreat – A short yet refreshing break for beginners\n• 5-Day Rejuvenation Retreat – Ideal for balancing mind, body & energy\n• 7-Day Deep Wellness Journey – Includes full program with yoga, therapies, and excursions\n• 15-Day Transformational Retreat – For serious practitioners seeking deep healing, discipline, and renewal\n\nAll packages include:\n- Yoga classes\n- Meals\n- Accommodation\n- Ayurveda therapy sessions\n- Guided outdoor activities"
  },
];


const WhatWeDo = () => {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Banner */}
      <div className="relative w-full md:h-[320px] h-[100px] flex items-center justify-center">
        <Image src="/bg7.jpg" alt="Banner" layout="fill" className="z-0 md:object-cover object-contain" priority />
        <div className="hidden md:flex absolute left-[10%] top-10 z-10 container w-fit mx-auto px-4 flex-col justify-center h-full bg-[#fcf7f1] rounded-xl">
          <div className="max-w-2xl flex flex-col items-center justify-center px-10">
            <h1 className="text-3xl  font-semibold text-black mb-2 drop-shadow-lg">The Impact of What We Do How <br /> We Make a Difference</h1>
            <div className="w-96 rounded-lg overflow-hidden">
              <Image src="/pic7.png" alt="Intro" width={300} height={300} className="object-cover w-full h-full" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="md:hidden flex container w-full mx-auto p-5 flex-col justify-center h-full bg-[#fcf7f1] rounded-xl">
          <div className="w-full flex flex-col items-center justify-center">
            <h1 className="text-xl font-semibold text-black text-center mb-2 drop-shadow-lg">The Impact of What We Do How <br /> We Make a Difference</h1>
            <div className="w-full rounded-lg overflow-hidden">
              <Image src="/pic7.png" alt="Intro" width={300} height={300} className="object-cover w-full h-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="md:p-10">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row md:gap-10">
            {/* Left Side */}
            <div className="lg:w-7/12 w-full">
              <div className=" p-8 md:mb-8">
                <h4 className="pacifico-h2 text-green-800 text-xl md:text-2xl md:text-3xl mb-4">Wellness Retreats – A Sanctuary in Nature.</h4>
                <p className="md:text-base text-gray-700 mb-4">
                  At our Wellness Retreats in Tapovan, Rishikesh, we offer a complete and immersive wellness experience that nurtures the body, mind, and soul. Whether you're a beginner or an advanced practitioner, our programs are designed to guide you on a journey of inner healing and mindful living—amidst the spiritual energy of the Himalayas. <br /><br />

                </p>
                <div className="max-w-xl mx-auto px-6 py-4 border border-gray-300 rounded-2xl relative">
                  <blockquote className="relative">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Why Choose Us?</h2>

                    <ul className="space-y-3 text-gray-800 font-medium list-none">
                      <li>• Located in the spiritual hub of Rishikesh, near the sacred Ganga</li>
                      <li>• Led by experienced yoga teachers and wellness professionals</li>
                      <li>• Authentic practices rooted in ancient Indian traditions</li>
                      <li>• Personalized approach to wellness and healing</li>
                      <li>• Clean, serene, and eco-conscious accommodation</li>
                    </ul>

                    <div className="flex justify-between items-center mt-6">
                      <div className="flex gap-2">
                        <hr className="my-6 border-t border-black w-10" />
                        <img src="/A1.jpg" alt="Logo Image" className="h-16 w-auto" />

                      </div>

                      <span className="md:text-7xl text-5xl text-black font-serif">”</span>
                    </div>
                  </blockquote>
                </div>
                {/* Accordion */}
                <div className="w-full max-w-2xl mx-auto mb-8 mt-10">
                  {accordionData.map((item, idx) => {
                    // Create a ref for each accordion item
                    const contentRef = React.useRef(null);
                    // Calculate maxHeight for transition
                    const isOpen = openIndex === idx;
                    const [height, setHeight] = React.useState(0);

                    React.useEffect(() => {
                      if (isOpen && contentRef.current) {
                        setHeight(contentRef.current.scrollHeight);
                      } else {
                        setHeight(0);
                      }
                    }, [isOpen]);

                    return (
                      <div key={idx} className="mb-2 border border-gray-200 rounded-lg bg-white">
                        <button
                          className={`w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-lg transition focus:outline-none ${isOpen ? 'text-amber-700' : 'text-gray-800'}`}
                          onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                          aria-expanded={isOpen}
                        >
                          <span>{item.title}</span>
                          <span className="text-3xl">{isOpen ? '-' : '+'}</span>
                        </button>
                        <div
                          ref={contentRef}
                          style={{
                            maxHeight: isOpen ? height : 0,
                            opacity: isOpen ? 1 : 0,
                            overflow: 'hidden',
                            transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s',
                          }}
                          className="px-6 py-2"
                        >
                          <p className="text-gray-700 text-base whitespace-pre-line">{item.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
            {/* Right Side - keep width fixed and separated */}
            <div className="lg:w-5/12 w-full flex items-center justify-center sticky top-20 self-start p-10 md:p-0">
              <div className="w-full max-w-md rounded-xl overflow-hidden bg-white shadow-lg">
                <Image
                  src="/image.png"
                  alt="Rishikesh"
                  width={600}
                  height={800}
                  className="object-cover w-full h-auto"
                  style={{ aspectRatio: '3/4' }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Get in Touch Section */}
      <div className="">
        <section className="w-full bg-black py-5 text-white flex flex-col md:flex-row items-center justify-between md:px-24 md:gap-6 gap-2">
          <div className="md:mb-6 mb-2 md:mb-0">
            <h3 className="text-xl text-center md:text-start md:text-2xl md:text-3xl font-bold gap-2">Questions?
              <br className="md:hidden"/>
              <span className="md:text-lg text-base font-normal px-2">Our experts will help find the gear that’s right for you</span>
            </h3>
        </div>
        <Link href="/contact" className="btn bg-white text-black font-bold px-8 py-3 rounded-lg shadow transition">Get In Touch</Link>
      </section>
      </div>
    </div>
  );
};

export default WhatWeDo;