import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return <>
    <section className="relative w-full h-[520px] sm:h-[600px] lg:h-[650px] overflow-hidden rounded-b-4xl">
  
  {/* Background Image Full Width */}
  <Image
    src="/images/WhatsApp Image 2026-04-27 at 10.39.36 PM.jpeg"
    alt="hero"
    fill
    priority
    className="object-cover object-center"
  />
  {/* Content Container */}
  <div className="relative z-10 h-full flex items-end justify-start">
   <div className="w-full px-4 sm:px-8 lg:px-16 text-left mb-15">
      
      <h1 className="text-white font-bold text-2xl sm:text-3xl lg:text-2xl leading-tight">
        Learn Languages & Tech Skills
      </h1>

      <p className="text-white/90 text-sm sm:text-base mt-4 leading-relaxed max-w-md">
        Connect with people around the world <br />
        and exchange languages and tech skills
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Link href= "/choose-role"> <button className="px-6 py-3 rounded-xl bg-white/35 text-white font-medium shadow-md hover:bg-white/45 transition">
          Get started
        </button>
        </Link>

        <button className="px-6 py-3 rounded-xl bg-white/35 text-white font-medium shadow-md hover:bg-white/45 transition">
          Browse skills
        </button>
      </div>
    </div>
  </div>
</section>
<section className="bg-[#D7DBE7]">
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <h2 className="text-center font-bold text-lg sm:text-xl text-black tracking-wide">
            HOW IT WORKS
          </h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="bg-gradient-to-b from-[#EEE3F4] to-[#CEE5F5] rounded-xl shadow-md p-6 text-center">
              <Image
                src="/images/amico.svg"
                alt="Create Profile"
                width={250}
                height={180}
                className="mx-auto"
              />
              <h3 className="mt-6 font-bold text-lg text-black">
                Create a Profile
              </h3>
            </div>

            <div className="bg-gradient-to-b from-[#EEE3F4] to-[#CEE5F5] rounded-xl shadow-md p-6 text-center">
              <Image
                src="/images/rafiki.svg"
                alt="Find Partner"
                width={250}
                height={180}
                className="mx-auto"
              />
              <h3 className="mt-6 font-bold text-lg text-black">
                Find a Partner
              </h3>
            </div>

            <div className="bg-gradient-to-b from-[#EEE3F4] to-[#CEE5F5] rounded-xl shadow-md p-6 text-center">
              <Image
                src="/images/amico3.svg"
                alt="Schedule Session"
                width={250}
                height={180}
                className="mx-auto"
              />
              <h3 className="mt-6 font-bold text-lg text-black">
                Schedule a Session
              </h3>
            </div>

          </div>
        </div>
      </section>

     {/* TRENDING EXCHANGES */}
     
<section className="pb-16">
  <div className="max-w-6xl mx-auto px-4 sm:px-8">
    <h2 className="text-center font-bold text-lg sm:text-xl text-black">
      Trending Exchanges
    </h2>
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="relative rounded-xl overflow-hidden shadow-md h-[260px] sm:h-[450px]">
        
        <Image
          src="/images/ceafebfcde4832be659f58998756a99c6cd93e46 (1).jpg"
          alt="Teach Exchange"
          fill
          className="object-cover"
        />
        <h3 className="absolute top-5 left-0 right-0 text-center text-white font-semibold text-lg">
          Teach Exchange
        </h3>
        <div className="absolute bottom-2 left-1/2 -translate-y-1/2 flex flex-col gap-3 w-[40%] sm:w-[40%]">
          <button className="bg-white/35 text-white py-2 rounded-lg font-semibold shadow-md">
            Front-End
          </button>
          <button className="bg-white/35 text-white py-2 rounded-lg font-semibold shadow-md">
            Back-End
          </button>
        </div>
      </div>
      <div className="relative rounded-xl overflow-hidden shadow-md h-[260px] sm:h-[450px]">
        
        <Image
          src="/images/WhatsApp Image 2026-04-27 at 10.39.36 PM.jpeg"
          alt="Languages"
          fill
          className="object-cover"
        />
        <h3 className="absolute top-5 left-0 right-0 text-center text-white font-semibold text-lg">
          Languages
        </h3>
        <div className="absolute bottom-15 left-1/2 -translate-y-1/2 flex flex-col  w-[40%] sm:w-[40%]">
          <button className="bg-white/35 text-white py-2 rounded-lg font-semibold shadow-md">
            English
          </button>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* KEY FEATURES */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <h2 className="text-center font-bold text-lg text-black">
            Key Features
          </h2>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center">

            <div>
              <Image
                src="/images/amico4.svg"
                alt="Feature 1"
                width={250}
                height={200}
                className="mx-auto"
              />
              <h3 className="mt-4 font-bold text-black">
                Smart Video & Code Hub
              </h3>
              <p className="text-sm text-black/70 mt-2">
                Smart start to possible to world <br />
                dual-interface based Interface
              </p>
            </div>

            <div>
              <Image
                src="/images/pana.svg"
                alt="Feature 2"
                width={250}
                height={200}
                className="mx-auto"
              />
              <h3 className="mt-4 font-bold text-black">
                Skill Level Matching
              </h3>
              <p className="text-sm text-black/70 mt-2">
                Find a progress-ward skill level <br />
                niotchig a levels over.
              </p>
            </div>

            <div>
              <Image
                src="/images/amico2.svg"
                alt="Feature 3"
                width={250}
                height={200}
                className="mx-auto"
              />
              <h3 className="mt-4 font-bold text-black">
                Community Forums
              </h3>
              <p className="text-sm text-black/70 mt-2">
                Community forums Now Flie wold <br />
                and archones enchoenen skills
              </p>
            </div>

          </div>
        </div>
      </section>

    {/* READY TO CONNECT */}
<section className="pb-16 px-4 sm:px-8 lg:px-16">
  <div className="relative w-full max-w-6xl mx-auto rounded-[22px] overflow-hidden shadow-lg h-[220px] sm:h-[300px] flex items-center justify-center">

    
    <Image
      src="/images/WhatsApp Image 2026-04-27 at 10.39.36 PM.jpeg"
      alt="connect"
      fill
      className="object-cover"
    />
    <div className="absolute inset-0 bg-[#7788A8]/60"></div>
    <div className="relative z-10 w-full flex flex-col items-center justify-center px-6 sm:px-10">
      <h2 className="text-white font-bold text-lg sm:text-xl mb-6">
        Ready to connect ?
      </h2>
      <div className="relative w-full max-w-xxl bg-white rounded-full">
        <input
          placeholder="Search....."
          className="w-full h-[50px] rounded-full px-6 pr-14 outline-none text-black shadow-md"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#7B1C7C] text-white flex items-center justify-center">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    <Link href= "/choose-role">  <button className="mt-5 px-10 py-4 rounded-lg bg-[#76287C] text-white font-medium shadow-md transition">
        Join the exchange
      </button>
      </Link>
    </div>
  </div>
</section>
</section>

    
  </>
}