"use client";
import Image from "next/image";
import Link from "next/link";
import './fonts/fonts.css';
const VisionMission = () => {
  return (
    <section className="w-full  bg-[#fcf7f1] min-h-screen">
      <div className="w-full">
        <div className="relative w-full h-[280px] flex items-center justify-center bg-[#fcf7f1] overlay-black-light">
          <Image
            src="/bg3.jpg"
            alt="Vision Mission Banner"
            layout="fill"
            objectFit="cover"
            className="z-0 opacity-80"
            priority
          />
          <div className="relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">Our Vision & Mission</h1>
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
        <div className="w-full container mx-auto flex gap-10 items-center mt-10">
          {/* Left: Intro & Image */}
          <div className="w-full flex flex-col items-start">
            <h2 className="pacifico-h2 text-green-800 text-3xl md:text-4xl mb-6 text-start lg:text-start">“Wellness Retreats – A Sanctuary in Nature.”</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center lg:text-justify">
              Nestled in the heart of Tapovan, Rishikesh, our Wellness Retreats Programme offers a serene space for individuals seeking balance, renewal, and transformation. Surrounded by the tranquil beauty of the Himalayas and the sacred Ganga, we invite you to disconnect from the chaos and reconnect with your true self.<br /><br />
              Our retreats are thoughtfully designed to harmonize body, mind, and spirit—blending traditional yoga and meditation, Ayurvedic therapies, nature walks, and mindful nutrition. Whether you're a beginner or a seasoned practitioner, our experienced wellness guides and yoga teachers ensure a nurturing, personalized journey toward healing and self-discovery.
            </p>
          </div>

        </div> {/* Right: Vision & Mission */}
        <div className="container mx-auto w-full flex md:flex-row flex-col w-full gap-8">
          <div className="md:w-2/3 w-full flex justify-center mb-6 ">
            <Image src="/Vision.png" alt="Vision Mission Banner" width={500} height={500} className="rounded-xl shadow-lg object-cover w-fit h-auto " />
          </div>
          {/* Vision */}
          <div className="md:w-1/2 w-full flex-col mb-4">
            <div className="rounded-xl  p-6 mb-4 border border-gray-400">
              <h3 className="text-2xl font-bold mb-2 text-amber-700">Our Vision</h3>
              <p className="text-gray-700 text-base">
              "To be a globally recognized haven for holistic well-being, where ancient practices and natural beauty guide individuals toward a life of mindfulness, health, and inner harmony."
              </p>
            </div>
            {/* Mission */}
            <div className=" rounded-xl  p-6 border border-gray-400">
              <h3 className="text-2xl font-bold mb-2 text-amber-700">Our Mission</h3>
              <ul className="pl-6 text-gray-700 text-base space-y-2">
                <li>We are committed to curating authentic, soul-nourishing wellness experiences that spark personal transformation and holistic healing. Through a thoughtfully crafted blend of yoga, meditation, Ayurvedic therapies, and nature-based healing, we create immersive retreats that go beyond relaxation—they awaken self-awareness, restore balance, and promote long-term well-being.</li>
                <li>Our programmes are grounded in the rich spiritual and cultural heritage of Rishikesh, and guided by experienced practitioners who honor ancient traditions while adapting to individual needs. We incorporate local wisdom, sustainable practices, and community involvement, ensuring that our retreats not only serve our guests, but also uplift the environment and local livelihoods.</li>
                <li>By connecting people back to the rhythms of nature and inner stillness, we inspire a way of life rooted in mindfulness, compassion, and sustainability—helping individuals return home with tools for lasting wellness, and a deeper connection to themselves and the world around them.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
      {/* Get In Touch Section */}
      <section className="w-full bg-black py-5 text-white flex flex-col md:flex-row items-center justify-between  md:px-24 gap-6 ">
        <div className="md:mb-0 px-3">
          <h3 className="text-2xl md:text-3xl font-bold gap-2">Questions?
            <span className="text-lg font-normal px-2">Our experts will help find the gear that’s right for you</span>
          </h3>
        </div>
        <Link href="/contact" className="btn bg-white text-black font-bold px-8 py-3 rounded-lg shadow transition">Get In Touch</Link>
      </section>
    </section>

  );
};

export default VisionMission;