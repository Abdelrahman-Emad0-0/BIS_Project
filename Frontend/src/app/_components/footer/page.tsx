import Link from "next/link";


export default function Footer() {
  return <>
     <footer className="bg-[#D7DBE7] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <div>
            <h3 className="font-bold text-black mb-2">Site & Change</h3>
            <p className="text-sm text-black/70 leading-relaxed">
              Connect with people around the <br />
              world and exchange Languages <br />
              and Tech skills
            </p>
          </div>

          <div>
            <h3 className="font-bold text-black mb-2">Home</h3>
            <ul className="text-sm text-black/70 space-y-1">
              <li>About</li>
              <li>Contact</li>
              <li>Policy</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-black mb-2">Links</h3>
            <ul className="text-sm text-black/70 space-y-1">
              <li>Login</li>
              <li>Register</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-black mb-2">Social Media</h3>
            <div className="flex gap-4 mt-2 text-lg">
              <i className="fa-brands fa-facebook "></i>
              <i className="fa-brands fa-square-instagram"></i>

            </div>
          </div>

        </div>
      </footer>
  </>
}