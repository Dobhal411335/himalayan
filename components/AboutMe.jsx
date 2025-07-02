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
const teamMembers = [
  { name: "John Doe", role: "CEO & Founder" },
  { name: "Ivan Mathews", role: "iOS Developer" },
  { name: "Macauley Herring", role: "Customer Success" },
  { name: "Alya Levine", role: "CTO" },
  { name: "Rose Hernandez", role: "Backend Developer" },
  { name: "Elen Benitez", role: "Designer" },
];
const AboutMe = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="w-full min-h-screen bg-[#fcf7f1]">
      {/* Banner */}
      <div className="relative w-full h-[350px] flex items-center justify-center bg-secondary overlay-black-light">
        <Image
          src="/bg1.jpg"
          alt="About Banner"
          layout="fill"
          objectFit="cover"
          className="z-0 opacity-80"
          priority
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">Himalayan Wellness Retreats</h1>
          {/* <nav aria-label="breadcrumb" className="flex justify-center"> */}
          {/* <ul className="flex gap-2 text-lg">
              <li>
                <Link href="/" className="hover:underline">Home</Link>
              </li>
              <li>/</li>
              <li className="text-amber-300">About Me</li>
            </ul> */}
          {/* </nav> */}
        </div>
      </div>

      {/* Main Content */}
      <section className="content-inner py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10 items-stretch">
            {/* Left: Text and Accordion */}
            <div className="lg:w-1/2 flex flex-col justify-center overflow-y-auto">
              <div className="mb-8">
                <h2 className="pacifico-h2 text-4xl md:text-5xl mb-6 text-green-800">"Breathe. Stretch. Transform. Find Your Flow, Feel Your Peace."</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Himalayan Wellness Retreats invites you to a transformative journey nestled in the spiritual heartland of Tapovan, Rishikesh — where the charm of the sacred city meets the serene rhythm of the Ganges. Known as the Yoga Capital of the World, Rishikesh offers the perfect backdrop for inner healing, mindful living, and soulful exploration. Our thoughtfully curated retreats are designed to rejuvenate your body, mind, and spirit amidst the majestic Himalayan landscape. Each day begins with revitalizing yoga and meditation sessions led by experienced instructors, followed by nourishing yogic meals prepared from fresh, organic ingredients.<br /><br />
                  Immerse yourself in the local lifestyle as you explore ancient temples, vibrant artisan markets, and the awe-inspiring Ganga Aarti — all just steps away from our peaceful retreat in Tapovan. Guests enjoy serene accommodations with stunning views, nature walks, and spiritual excursions that connect you deeply with the essence of the region. Whether you seek inner peace, spiritual growth, or simply a conscious escape, Himalayan Wellness Retreats in Rishikesh offers a sacred space to reconnect—with yourself, with nature, and with the divine flow of life.<br /><br />
                  Explore the Spirit of Rishikesh — Where Every Breath is a Step Toward Wholeness.<br /><br />
                </p>
              </div>

              {/* Accordion */}
              <div className="w-full max-w-2xl mx-auto mb-8">
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
                  <Image src="/A1.jpg" alt="A1" width={900} height={600} className="rounded-lg shadow-lg object-cover w-full h-full" />
                </div>
                <div className="col-span-2">
                  <Image src="/A2.jpg" alt="A2" width={300} height={400} className="rounded-lg shadow-lg object-cover w-full h-full" />
                </div>

                <div className="col-span-5 row-span-2">
                  <Image src="/A3.jpg" alt="A3" width={800} height={300} className="rounded-lg shadow-lg object-cover w-full h-auto" />
                </div>
                <div className="col-span-5 row-span-2">
                  <Image src="/A4.jpg" alt="A4" width={400} height={300} className="rounded-lg shadow-lg object-cover w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get In Touch Section */}
      <section className="w-full bg-black py-5 text-white flex flex-col md:flex-row items-center justify-between  md:px-24 gap-6 ">
        <div className="mb-6 md:mb-0 px-3">
          <h3 className="text-2xl md:text-3xl font-bold gap-2">Questions?
            <span className="text-lg font-normal px-2">Our experts will help find the gear that’s right for you</span>
          </h3>
        </div>
        <Link href="/contact" className="btn bg-white text-black font-bold px-8 py-3 rounded-lg shadow transition">Get In Touch</Link>
      </section>

      {/* <section className="content-inner py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 mb-10 items-center">
          
            <div className="w-full lg:w-[57%]">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black leading-tight">Our Team of Experts</h2>
              <p className="text-md text-gray-700 mb-4">
                Behind Rishikesh Handmade Craft is a dedicated team of experienced professionals and industry veterans who share a deep passion for traditional Indian craftsmanship. Our core team includes expert artisans, designers, curators, and community leaders — many of whom have over 20 years of hands-on experience in the handicraft and cottage industry.
                <br />
                <br />
                These individuals have not only mastered their craft but have also played a pivotal role in shaping the future of local artisans. Through years of dedication, they have created opportunities, launched training initiatives, and set new benchmarks in quality and innovation. Their deep understanding of cultural artistry, sustainable practices, and market trends ensures that every product we offer meets the highest standards while staying true to its roots.
              </p>
            </div>
            
            <div className="w-full lg:w-[57%] flex flex-row gap-8 justify-center">
             
              <div className="flex flex-col items-center">
                <div className="relative w-72 h-72 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
                  <Image src="/pic1_1.jpg" alt="John Doe" width={224} height={224} className="object-cover w-full h-full" />
                
                 
                </div>
                <div className="mt-3 text-center">
                  <div className="font-bold text-lg">John Doe</div>
                  <div className="text-xs text-gray-600">CEO & Founder</div>
                </div>
              </div>
             
              <div className="flex flex-col items-center">
                <div className="w-72 h-72 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
                  <Image src="/pic1_1.jpg" alt="Ivan Mathews" width={224} height={224} className="object-cover w-full h-full" />
                </div>
                <div className="mt-3 text-center">
                  <div className="font-bold text-lg">Ivan Mathews</div>
                  <div className="text-xs text-gray-600">iOS Developer</div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-8 mb-10">
            {teamMembers.slice(2).map((member, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex flex-col items-center">
                  <div className="w-72 h-72 rounded-2xl overflow-hidden shadow-lg bg-[#d6f0fa] flex items-center justify-center">
                    <Image src="/pic1_1.jpg" alt="Ivan Mathews" width={224} height={224} className="object-cover w-full h-full" />
                  </div>
                  <div className="mt-3 text-center">
                    <div className="font-bold text-lg">Ivan Mathews</div>
                    <div className="text-xs text-gray-600">iOS Developer</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-10 text-base text-gray-700">
            These individuals have not only mastered their craft but have also played a pivotal role in shaping the future of local artisans. Through years of dedication, they have created opportunities, launched training initiatives, and set new benchmarks in quality and innovation. Their deep understanding of cultural artistry, sustainable practices, and market trends ensures that every product we offer meets the highest standards while staying true to its roots.
          </div>


         
          <section className="w-full py-16 flex flex-col md:flex-row items-center justify-center gap-8 relative overflow-hidden">
          
            <div className="relative flex-1 flex items-center justify-center min-h-[400px]">
              <img
                src="/pic1_1.jpg" // Place your image in public folder or update the path
                alt="Happy Client"
                className="object-contain h-[420px] z-10 relative"
              />
              
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg flex items-center gap-3 px-4 py-2 z-20">
                <div className="flex -space-x-2">
                  <img src="/pic1_1.jpg" alt="user1" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="/pic1_1.jpg" alt="user2" className="w-8 h-8 rounded-full border-2 border-white" />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-semibold">Our Satisfied User</span>
                  <span className="text-gray-500">+12K</span>
                </div>
              </div>
         
            </div>

           
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  What Our Clients Say<br />About Us
                </h2>
                <p className="text-gray-600 mb-8">
                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
                </p>
                <div className="flex items-center gap-4">
                  <img src="/pic1_1.jpg" alt="Kenneth Fong" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-gray-800">Kenneth Fong</div>
                    <div className="text-xs text-gray-500">Postgraduate Student</div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-[#FEEAD3] flex items-center justify-center text-gray-700 hover:bg-[#FDD7A2]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-[#FEEAD3] flex items-center justify-center text-gray-700 hover:bg-[#FDD7A2]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
         
        </div>
      </section> */}
    </div>
  );
};

export default AboutMe;