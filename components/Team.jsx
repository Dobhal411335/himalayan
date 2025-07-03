"use client";
import Image from "next/image";
import Link from "next/link";
import './fonts/fonts.css';
const teamMembers = [
  { name: "John Doe", role: "CEO & Founder" },
  { name: "Ivan Mathews", role: "iOS Developer" },
  { name: "Macauley Herring", role: "Customer Success" },
  { name: "Alya Levine", role: "CTO" },
  { name: "Rose Hernandez", role: "Backend Developer" },
  { name: "Elen Benitez", role: "Designer" },
];

const Team = () => {
  return (
    <div className="w-full min-h-screen bg-[#fcf7f1]">
      {/* Banner */}
      <div className="relative w-full h-[350px] flex items-center justify-center bg-secondary overlay-black-light">
        <Image
          src="/bg2.jpg"
          alt="Team Banner"
          layout="fill"
          objectFit="cover"
          className="z-0 opacity-80"
          priority
        />
      </div>
      {/* Main Content */}
      <section className="content-inner p-20">
        <div className="container mx-auto ">
          <div className="flex flex-col lg:flex-row gap-8 mb-10 items-start">
            {/* Left: Heading and Paragraph */}
            <div className="w-full lg:w-[60%]">
              <h2 className="pacifico-h2 text-green-800 text-3xl md:text-4xl mb-4">Experience You Can Trust. Where Expertise Meets Himalayan Spirit.</h2>
              <p className="text-xl text-gray-700 mb-4 w-full lg:w-[90%]">
              At Himalayan Wellness Retreats, our strength lies in the wisdom and dedication of our core team — a collective of experienced teachers, compassionate healers, and inspiring mentors. Each expert brings years of training in traditional practices such as yoga, meditation, Ayurveda, and holistic therapies, rooted in the sacred traditions of the Himalayas. More than instructors, they are soulful guides committed to your personal growth and well-being. With a deep understanding of ancient knowledge and a modern approach to healing, they create a nurturing environment where transformation begins — mindfully, gently, and authentically.

              </p>
            </div>
            {/* Right: Two Images in a row */}
            <div className="w-full lg:w-[43%] flex flex-row gap-8 items-start justify-center">
              {/* First Team Member */}
              <div className="flex flex-col items-center">
                <div className="relative w-72 h-72 rounded-2xl overflow-hidden shadow-lg bg-[#f6e9da] flex items-center justify-center">
                  <Image src="/pic1_1.jpg" alt="John Doe" width={224} height={224} className="object-cover w-full h-full" />
                  {/* Social Icons Overlay */}
                    {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-white/80 px-4 py-2 rounded-full shadow">
                      <a href="#" className="text-gray-700 hover:text-blue-600"><i className="fab fa-facebook-f" /></a>
                      <a href="#" className="text-gray-700 hover:text-blue-400"><i className="fab fa-twitter" /></a>
                      <a href="#" className="text-gray-700 hover:text-pink-500"><i className="fab fa-instagram" /></a>
                      <a href="#" className="text-gray-700 hover:text-blue-700"><i className="fab fa-linkedin-in" /></a>
                    </div> */}
                </div>
                <div className="mt-3 text-center">
                  <div className="font-bold text-lg">John Doe</div>
                  <div className="text-xs text-gray-600">CEO & Founder</div>
                </div>
              </div>
              {/* Second Team Member */}
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
          </div>

          {/* Team Grid */}
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
          These individuals have not only mastered the ancient science of yoga but have also played a pivotal role in nurturing the spiritual and personal growth of others. With years of dedicated practice and teaching, they have created transformative experiences, launched community-based wellness initiatives, and inspired a new generation of mindful living. Their deep understanding of yogic philosophy, holistic wellness, and sustainable practices ensures that every session goes beyond physical postures — offering a journey into balance, awareness, and inner peace, while staying true to the Himalayan spirit.
          </div>

          {/* Contributions Section */}
          <div className="rounded-xl p-8 border border-gray-400">
            <h2 className="pacifico-h2 text-green-800 text-3xl mb-4 text-gray-800">Our Team’s Impact – Nurturing Wellness & Uplifting Communities:</h2>
            <ul className="list-decimal pl-6 text-base text-gray-700 space-y-2">
              <span className="">At Himalayan Yoga Wellness Retreats, our team’s work extends far beyond the mat. Rooted in service and community upliftment, their contributions have helped shape a more holistic and sustainable wellness experience for all:</span>
              <li><span className="font-bold"> Mentoring and Training:</span> Our yoga experts have guided and mentored hundreds of aspiring practitioners and wellness facilitators, empowering the next generation through focused `training and authentic teachings in and around Rishikesh.</li>
              <li><span className="font-bold"> Empowering Communities:</span> Through collaborative wellness programs, our team has supported local artisans and wellness workers — helping them access ethical markets, increase their income, and achieve greater financial independence.</li>
              <li><span className="font-bold"> Innovation with Tradition: </span> By blending ancient yogic wisdom with contemporary wellness needs, our team ensures that every retreat remains both spiritually rooted and globally relevant.
              </li>
              <li><span className="font-bold">Creating Global Milestones:</span>From hosting international retreats to participating in cross-cultural collaborations, our team has played a key role in bringing Rishikesh’s soulful wellness traditions to a global audience.</li>
              <li><span className="font-bold">Committed to a Sustainable Future:</span>More than just experts, they are changemakers. With their vision and dedication, our retreats not only preserve Himalayan heritage but also create meaningful opportunities for local communities to thrive.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;