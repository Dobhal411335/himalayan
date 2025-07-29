"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import './fonts/fonts.css';
const accordionData = [
  {
    title: "What Makes Us Unique?",
    content: `Nestled in the serene foothills of the Himalayas, our wellness retreats offer more than just a break — they provide a deep journey into holistic healing and self-discovery. What sets us apart is our blend of traditional Himalayan wisdom and modern wellness practices. From yoga and meditation guided by experienced gurus to Ayurvedic therapies using locally sourced herbs, every experience is rooted in authenticity. Located in the spiritual heart of Rishikesh, our retreats offer peaceful surroundings, organic meals, and personalized care — creating a sanctuary where mind, body, and soul reconnect in harmony.`
  },
  {
    title: "Sustainable & Eco-Friendly",
    content: `At Himalayan Wellness Retreats, sustainability is not just a practice — it's a way of life. Our retreats are designed to harmonize with nature, using eco-friendly infrastructure, locally sourced organic food, and zero-plastic policies. We support local artisans and communities, ensuring that your stay contributes to the region’s well-being. Every guest is welcomed like family, with warm hospitality and personalized care that reflects the spirit of the Himalayas. Here, your journey to wellness is gentle on the earth and deeply enriching for the soul.`
  },
  {
    title: "Empowering Local Artisans",
    content: `At Himalayan Wellness Retreats, we believe that wellness is a journey for everyone — whether you're just beginning or have years of experience. Our programs are thoughtfully designed to meet you where you are. Beginners are gently guided with patience and clarity, while seasoned practitioners are offered deeper insights and advanced practices. Through expert instruction, mindful support, and an inclusive atmosphere, we empower every individual to grow, heal, and reconnect with their inner self at their own pace — all in the nurturing embrace of the Himalayas.`
  },
  {
    title: "Cultural Preservation",
    content: `At Himalayan Wellness Retreats, cultural preservation is at the heart of our mission. We are deeply rooted in the traditions of the Himalayas, and we strive to keep this rich heritage alive through every experience we offer. From ancient yoga and meditation practices to Ayurvedic healing, Vedic rituals, and local art forms, we embrace and share the timeless wisdom of our ancestors. By collaborating with local communities, healers, and artisans, we not only protect these traditions but also empower the people who carry them forward — ensuring they thrive for generations to come.`
  },
  {
    title: "Global Accessibility with Local Roots",
    content: `Himalayan Wellness Retreats bridges the gap between ancient traditions and modern lifestyles, offering globally accessible wellness experiences deeply rooted in local Himalayan culture. Whether you’re joining us from across the world or nearby, our retreats are designed to be inclusive, welcoming, and easy to access. While we open our doors to international seekers of peace and balance, we remain firmly connected to our local roots — celebrating regional wisdom, supporting indigenous communities, and preserving the authenticity that makes our retreats truly unique.

We sincerely thank you for being part of our journey to preserve Himalayan heritage and empower both seasoned practitioners and those just beginning their wellness path. Your support helps us sustain ancient traditions, uplift local communities, and create an inclusive space where everyone can heal, grow, and thrive — rooted in authenticity, guided by purpose.`
  }
];
const AboutMe = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="w-full min-h-screen bg-[#fcf7f1]">
      {/* Banner */}
      <div className="relative w-full md:h-[350px] h-[100px] flex items-center justify-center bg-secondary">
        <Image
          src="/bg1.jpg"
          alt="About Banner"
          layout="fill"
          className="z-0 md:object-cover object-contain"
          priority
        />
      </div>
      {/* Main Content */}
      <section className="content-inner md:p-10 p-4 overflow-hidden">
        <div className="container mx-auto md:px-20 px-5">
          <div className="flex flex-col md:flex-row gap-5 md:gap-10 items-stretch">
            {/* Left: Text and Accordion */}
            <div className="lg:w-1/2 w-full flex flex-col justify-center overflow-y-auto">
              <div className="mb-8">
                <h2 className="pacifico-h2 text-green-800 text-xl md:text-3xl md:mb-6 mb-4">"Breathe. Stretch. Transform. Find Your Flow, Feel Your Peace."</h2>
                <p className="md:text-lg text-md text-gray-700 leading-relaxed mb-6">
                  Himalayan Wellness Retreats invites you to a transformative journey nestled in the spiritual heartland of Tapovan, Rishikesh — where the charm of the sacred city meets the serene rhythm of the Ganges. Known as the Yoga Capital of the World, Rishikesh offers the perfect backdrop for inner healing, mindful living, and soulful exploration. Our thoughtfully curated retreats are designed to rejuvenate your body, mind, and spirit amidst the majestic Himalayan landscape. Each day begins with revitalizing yoga and meditation sessions led by experienced instructors, followed by nourishing yogic meals prepared from fresh, organic ingredients.<br /><br />
                  Immerse yourself in the local lifestyle as you explore ancient temples, vibrant artisan markets, and the awe-inspiring Ganga Aarti — all just steps away from our peaceful retreat in Tapovan. Guests enjoy serene accommodations with stunning views, nature walks, and spiritual excursions that connect you deeply with the essence of the region. Whether you seek inner peace, spiritual growth, or simply a conscious escape, Himalayan Wellness Retreats in Rishikesh offers a sacred space to reconnect—with yourself, with nature, and with the divine flow of life.<br /><br />
                  Explore the Spirit of Rishikesh — Where Every Breath is a Step Toward Wholeness.<br /><br />
                </p>
              </div>

              {/* Accordion */}
              <div className="w-full md:max-w-2xl mx-auto mb-8">
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
                    <div key={idx} className="mb-2 border border-gray-200 rounded-lg bg-white shadow-sm">
                      <button
                        className={`w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-lg transition focus:outline-none ${isOpen ? 'text-amber-700' : 'text-gray-800'}`}
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

            {/* Right: Images Grid */}
            <div className="lg:w-1/2 min-h-[600px] h-full flex ">
              <div className="grid grid-cols-5 gap-4 w-full ">
                <div className="col-span-3">
                  <Image src="/A1.jpg" alt="A1" width={900} height={400} className="rounded-lg object-contain w-full h-full" />
                </div>
                <div className="col-span-2">
                  <Image src="/A2.jpg" alt="A2" width={300} height={400} className="rounded-lg object-contain w-full h-full" />
                </div>

                <div className="col-span-5 row-span-2">
                  <Image src="/A3.jpg" alt="A3" width={800} height={300} className="rounded-lg object-contain w-full h-auto" />
                </div>
                <div className="col-span-5 row-span-2">
                  <Image src="/A4.jpg" alt="A4" width={400} height={300} className="rounded-lg object-contain w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutMe;