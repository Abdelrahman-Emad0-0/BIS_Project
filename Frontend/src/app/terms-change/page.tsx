import Link from "next/link";
export default function TermsChange() {
  return <>
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-gradient-to-b from-[#2E4FA8] via-[#1B2C68] to-[#3B145A]">
      {/* White Box */}
      <div className="w-full max-w-5xl bg-white shadow-2xl px-6 sm:px-12 py-10 relative">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <i className="fa-solid fa-scroll text-5xl text-black"></i>
        </div>

        {/* Title */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="h-[1px] w-24 sm:w-40 bg-black/60"></div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
            TERMS OF SERVICE
          </h1>
          <div className="h-[1px] w-24 sm:w-40 bg-black/60"></div>
        </div>

        {/* Scroll Content */}
        <div className="h-[520px] sm:h-[560px] overflow-y-auto pr-4 custom-scroll">
          
          {/* PAGE 1 CONTENT */}
          <div className="text-[14px] sm:text-[15px] leading-7 text-black">
            <p className="font-bold">Violations & Penalties</p>
            <p>Failure to follow the support policy may result in:</p>
            <ul className="list-disc ml-6">
              <li>Points deduction</li>
              <li>Temporary suspension from the exchange feature for 2 months</li>
              <li>Increased service fee to 1700 EGP upon return</li>
            </ul>

            <p className="mt-6 font-bold">Repeated violations may lead to:</p>
            <ul className="list-disc ml-6">
              <li>Permanent removal from the exchange system</li>
              <li>Account suspension</li>
              <li>Content removal from the platform</li>
            </ul>

            <p className="mt-6 font-bold">Learner Compensation</p>
            <p>
              If a teaching partner fails to complete their responsibilities,
              the learner may receive compensation by reducing future service fees
              from 1500 EGP to 1300 EGP.
            </p>

            <p className="mt-6 font-bold">Platform Conduct</p>
            <p>All users must:</p>
            <ul className="list-disc ml-6">
              <li>Respect other participants</li>
              <li>Avoid inappropriate behavior</li>
              <li>Follow platform policies and guidelines</li>
            </ul>

            <p className="mt-6 font-bold">Ratings & Moderation</p>
            <p>
              Negative ratings, complaints, or inappropriate behavior will be reviewed
              by the platform administration and handled accordingly.
            </p>

            <p className="mt-6 font-bold">Points & Rewards System</p>
            <p>Users can earn points by:</p>
            <ul className="list-disc ml-6">
              <li>Completing exchanges successfully</li>
              <li>Submitting constructive feedback</li>
              <li>Supporting partners during the extra month</li>
            </ul>

            <p className="mt-6 font-bold">Points can later be redeemed for:</p>
            <ul className="list-disc ml-6">
              <li>Discounts</li>
              <li>Free sessions</li>
              <li>Platform rewards</li>
            </ul>

            <p className="mt-6 font-bold">Penalties</p>
            <p>Points deduction or temporary suspension may occur in cases of:</p>
            <ul className="list-disc ml-6">
              <li>Failure to follow up</li>
              <li>Misbehavior</li>
              <li>Repeated verified complaints</li>
            </ul>

            <p className="mt-6">
              Serious or repeated violations may result in permanent removal from the
              exchange feature or full account suspension.
            </p>

            {/* Divider between 2 pages */}
            <div className="my-10 border-t border-black/20"></div>

            {/* PAGE 2 CONTENT */}
            <p className="font-bold">Exchange Commitment</p>
            <p>
              Once the exchange is confirmed, participants cannot withdraw from the
              course without valid reason approved by the platform.
            </p>

            <p className="mt-6 font-bold">Platform Service Fee</p>
            <p>
              Each participant must pay a service fee of 1500 EGP before starting the exchange.
            </p>

            <p className="mt-4 font-bold">This fee covers:</p>
            <ul className="list-disc ml-6">
              <li>Secure learning environment</li>
              <li>Session management</li>
              <li>Scheduling & tracking</li>
              <li>Ratings & reviews system</li>
              <li>Platform support services</li>
            </ul>

            <p className="mt-4">
              ⚠ There is no direct financial exchange between participants.  
              The exchange itself is based on knowledge sharing.
            </p>

            <p className="mt-6 font-bold">Content Submission</p>
            <p>
              Both participants are required to upload the agreed course content to the
              platform after payment confirmation.
            </p>

            <p className="mt-6 font-bold">Learning Commitment</p>
            <p>
              Participants are expected to follow the recommended learning plan and complete
              the exchange within the suggested timeframe.
            </p>

            <p className="mt-6 font-bold">Reviews & Feedback</p>
            <p>After each level, both participants must submit:</p>
            <ul className="list-disc ml-6">
              <li>Ratings</li>
              <li>Feedback</li>
              <li>Improvement suggestions</li>
            </ul>

            <p className="mt-4">
              This helps improve the learning experience and maintain quality.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-30 mt-10">
          <Link href ="/dashboardUser">
          <button className="w-full sm:w-48 py-4 bg-gradient-to-b from-[#2449A3] to-[#0D1C55] text-white font-semibold shadow-md hover:opacity-90 transition">
            Accept
 </button>
 </Link>
            <Link href ="/">
          <button className="w-full sm:w-48 py-4 bg-gradient-to-b from-[#2449A3] to-[#0D1C55] text-white font-semibold shadow-md hover:opacity-90 transition">
            Decline
          </button>
          </Link>
        </div>
      </div>
    </div>
  </>
}