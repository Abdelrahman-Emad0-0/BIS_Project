import Image from "next/image";
import Link from "next/link";

export default function ChooseRolePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden text-white flex items-center justify-center px-4 sm:px-8 lg:px-16 py-16">
      
      
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/f55e7d87e909736d52c8c3a2037c17112ca0caf2.png"
          alt="background"
          fill
          priority
          className="object-cover"
        />
      </div>

      <section className="w-full max-w-4xl flex flex-col items-center ">
        
       
        <h1 className="text-center text-2xl sm:text-3xl lg:text-3xl font-bold">
          How Would You Like to Use Learn X Change?
        </h1>

        <p className="text-center mt-3 text-sm sm:text-base text-white/80">
          Choose how you want to start your journey
        </p>

        
        <div className="mt-14 w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          
          
          <div className="w-[300px] h-[250px] rounded-[24px] border border-white/20 bg-[#2A0F46]/60 backdrop-blur-md shadow-xl p-8 flex flex-col justify-between text-center">
            <div>
              <h2 className="text-lg font-bold">I want to learn</h2>

              <div className="flex justify-center mt-3 text-white/80 text-5xl">
                 <Image
          src="/images/Class-Lesson--Streamline-Plump-Neon.png"
          alt="icon"
          width={50}
          height={20}
          priority
          className="object-cover"
        />
              </div>

              <p className="mt-2 text-white/80 text-base leading-relaxed">
                Learn languages or <br />
                tech skills from others
              </p>
            </div>

         <Link href="/register"><button className="mb-15 mx-auto w-[200px] py-3 rounded-xl bg-gradient-to-r from-[#A173A1] to-[#FAFAFA] text-[#2A0440] font-semibold shadow-lg hover:scale-105 transition">
              Start Learning
            </button>
            </Link>
          </div>
          

         
          <div className="w-[300px] h-[250px] rounded-[24px] border border-white/20 bg-[#2A0F46]/60 backdrop-blur-md shadow-xl p-8 flex flex-col justify-between text-center">
            <div>
              <h2 className="text-lg font-bold">Learn & tech</h2>

              <div className="flex justify-center mt-3 text-white/80 text-5xl">
                  <Image
          src="/images/Sun--Streamline-Plump-Neon.png"
          alt="icon"
          width={50}
          height={20}
          priority
          className="object-cover"
        />
              </div>

              <p className="mt-2 text-white/80 text-base leading-relaxed">
                Teach what you know <br />
                & learn something new
              </p>
            </div>

        <Link href="/register-change"><button className="mb-15 mx-auto w-[200px] py-3 rounded-xl bg-gradient-to-r from-[#FAFAFA] to-[#A173A1] text-[#2A0440] font-semibold shadow-lg hover:scale-105 transition">
              Learn & Tech
            </button>
            </Link>
            
          </div>

          
          <div className="w-[300px] h-[250px] rounded-[24px] border border-white/20 bg-[#2A0F46]/60 backdrop-blur-md shadow-xl p-8 flex flex-col justify-between text-center">
            <div>
              <h2 className="text-lg font-bold">I want to Teach</h2>

              <div className="flex justify-center mt-3 text-white/80 text-5xl">
                  <Image
          src="/images/graduation-cap--graduation-cap-education.png"
          alt="icon"
          width={50}
          height={20}
          priority
          className="object-cover"
        />
              </div>

              <p className="mt-2 text-white/80 text-base leading-relaxed">
                Share your knowledge <br />
                and help others learn
              </p>
            </div>

           <Link href="/register-teacher" >  <button className="mb-15 mx-auto w-[200px] py-3 rounded-xl bg-gradient-to-r from-[#A173A1] to-[#FAFAFA] text-[#2A0440] font-semibold shadow-lg hover:scale-105 transition">
              Start Teaching
            </button>
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}