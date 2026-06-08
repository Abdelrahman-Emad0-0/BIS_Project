import Link from "next/link";
export default function TermsTeach() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#1A2E5A]  to-[#3762C0] px-4 py-10">

      {/* Card */}
      <div className="w-full max-w-6xl bg-white shadow-2xl relative px-10 py-12 md:px-16 md:py-14">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <i className="fa-solid fa-scroll text-5xl text-black"></i>
        </div>

        {/* Title */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="h-[1px] w-32 md:w-60 bg-black/70"></div>

          <h1 className="text-xl md:text-2xl font-extrabold tracking-widest text-black">
            TERMS OF SERVICE
          </h1>

          <div className="h-[1px] w-32 md:w-60 bg-black/70"></div>
        </div>

        {/* Scroll Content */}
        <div className="max-h-[520px] overflow-y-auto pr-8 custom-scroll">

          <div className="text-gray-700 leading-relaxed text-[15px] md:text-[16px] space-y-10">


            <div>
              <h2 className="font-bold text-gray-900 mb-2">
                -Quality & Originality:
              </h2>
              <p>
                Must comply with platform quality standards and provide original, non-copied content.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-gray-900 mb-2">
                -Fee Deduction Agreement:
              </h2>

              <ul className="list-disc pl-10 space-y-2">
                <li>20% fee deduction from each level’s payment.</li>
                <li>
                  15% fee deduction if the instructor brings a student from outside the platform
                  (as a promotion reward).
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-gray-900 mb-2">
                -Content Upload:
              </h2>

              <ul className="list-disc pl-10 space-y-2">
                <li>
                  The instructor should provide a free introductory video explaining and simplifying
                  the course concept and learning journey for each level to encourage student enrollment.
                </li>

                <li>
                  The instructor must upload the full educational content to the platform.
                </li>

                <li>
                  The platform is responsible for monitoring, controlling, and unlocking content after
                  student payment, in cooperation with the instructor.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-gray-900 mb-2">
                -Teaching Conduct:
              </h2>

              <ul className="list-disc pl-10 space-y-2">
                <li>Must stick to the curriculum and maintain professional behavior.</li>
                <li>Must respond to student questions and follow up regularly.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-gray-900 mb-2">
                -AdminReview:
              </h2>
              <p>
                All courses must be reviewed and approved by the admin before publishing.
              </p>
            </div>

            

            <div>
              <h2 className="font-bold text-gray-900 mb-2">
                Points & Rewards System
              </h2>

              <ul className="space-y-2">
                <li>- Instructors earn points when:</li>
                <li>- Uploading complete course content to the platform.</li>
                <li>- Actively responding and following up with students.</li>
                <li>- Receiving positive ratings and reviews.</li>
                <li>
                  - If the instructor reaches a certain points balance, they receive rewards such as:
                </li>
                <li>- Further reduced fee deduction (e.g., from 20% down to 15% based on performance).</li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-gray-900 mb-2">
                Penalties
              </h2>

              <ul className="space-y-2">
                <li>- Points deduction if the instructor delays in responding or following up with students.</li>
                <li>- Points deduction and account suspension if:</li>
                <li>- Misbehavior or inappropriate conduct occurs.</li>
                <li>- Repeated negative ratings (after verification).</li>
                <li>- Temporary account suspension if reported for violations or inappropriate content (after verification).</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Buttons */}
        <div className="mt-12 flex justify-center gap-30">
           <Link href ="/dashboardUser">
          <button className="w-[180px] py-3 bg-[#254180] text-white font-semibold shadow-md hover:opacity-90 transition">
            Accept
          </button>
          </Link>
                 <Link href ="/">
          <button className="w-[180px] py-3 bg-[#254180] text-white font-semibold shadow-md hover:opacity-90 transition">
            Decline
          </button>
          </Link> 
        </div>
      </div>
    </section>
  );
}

 
 
 
 
 



 
 
 
 
 