import Link from "next/link";


export default function Terms() {

  return <>
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#E7BFEA] to-[#40325E] px-4 py-12">

      {/* Card */}
      <div className="w-full max-w-5xl bg-white shadow-2xl relative p-10 md:p-14">

        {/* Icon */}
        <div className="flex justify-center mb-3">
          <i className="fa-solid fa-scroll text-4xl text-black"></i>
        </div>

        {/* Title */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="h-[1px] w-32 md:w-52 bg-black/70"></div>

          <h1 className="text-lg md:text-xl font-bold tracking-widest text-black">
            TERMS OF SERVICE
          </h1>

          <div className="h-[1px] w-32 md:w-52 bg-black/70"></div>
        </div>

        {/* Scroll Content */}
        <div className="max-h-[520px] overflow-y-auto pr-8 custom-scroll">

          <div className="text-gray-700 leading-relaxed text-[15px] md:text-[16px] space-y-10">

            {/* Section 1 */}
            <div>
              <h2 className="font-bold text-gray-800 mb-2">
                Conditions to Agree On
              </h2>
              <p>
                -Free Content Preview*: The student is allowed to watch one free video per level as a preview.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="font-bold text-gray-800 mb-2">
                Payment System:
              </h2>
              <ul className="space-y-2">
                <li>- Payment is *per level*, not for the entire course.</li>
                <li>- Each level has its own fee. Once paid, the level content is unlocked.</li>
                <li>- Refunds are *not allowed* after the content is unlocked.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="font-bold text-gray-800 mb-2">Exams</h2>
              <ul className="space-y-2">
                <li>- After each level, the student must take an exam.</li>
                <li>- Passing grade: *70%* to move to the next level.</li>
                <li>
                  - If the student wants to skip to a higher level directly, they must take a
                  *placement test* to determine if they need to enroll in earlier levels for quality assurance.
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="font-bold text-gray-800 mb-2">
                Platform Policies
              </h2>
              <ul className="space-y-2">
                <li>- Must comply with platform rules and not misuse content.</li>
                <li>- Account sharing is strictly prohibited.</li>
                <li>- Reviews and ratings are public and visible to all.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="font-bold text-gray-800 mb-2">
                Points & Rewards System
              </h2>
              <ul className="space-y-2">
                <li>- Students earn points when:</li>
                <li>- Completing the course within the defined *time frame*.</li>
                <li>- Positively engaging with the teacher.</li>
                <li>- Submitting reviews and feedback for each level.</li>
                <li>- Points accumulate until reaching a *reward balance*, which grants:</li>
                <li>- Discounts on future courses.</li>
                <li>- Free sessions.</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="font-bold text-gray-800 mb-2">
                Penalties
              </h2>
              <ul className="space-y-2">
                <li>- Points deduction or account suspension if:</li>
                <li>- Submitting inappropriate or offensive reviews.</li>
                <li>- Misbehaving or showing disrespect towards the instructor</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Buttons */}
      <div className="mt-10 flex justify-center gap-30">
         <Link href ="/dashboardUser">
          <button className="w-[170px] py-3 bg-[#53426E] text-white font-semibold shadow-md hover:opacity-90 transition">
            Accept
          </button>
          </Link>
  <Link href ="/">
          <button className="w-[170px] py-3 bg-[#53426E] text-white font-semibold shadow-md hover:opacity-90 transition">
            Decline
          </button>
          </Link>
        </div>
      </div>
    </section>
  </>
}