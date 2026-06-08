export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col items-center p-6 lg:p-12">
      
      {/* Header/Title Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#141033] mb-4">Contact Us</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          We'd love to hear from you. Have questions, suggestions, or feedback? Send us a message.
        </p>
      </div>

      {/* Contact Form Card */}
      <div className="bg-white w-full max-w-2xl rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 mb-12">
        <form className="flex flex-col gap-6">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#141033]">Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              className="w-full h-[50px] rounded-xl border border-gray-200 px-4 text-sm focus:border-[#602AEA] focus:ring-2 focus:ring-[#602AEA]/20 outline-none transition"
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#141033]">Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full h-[50px] rounded-xl border border-gray-200 px-4 text-sm focus:border-[#602AEA] focus:ring-2 focus:ring-[#602AEA]/20 outline-none transition"
            />
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#141033]">Subject</label>
            <input 
              type="text" 
              placeholder="Enter subject" 
              className="w-full h-[50px] rounded-xl border border-gray-200 px-4 text-sm focus:border-[#602AEA] focus:ring-2 focus:ring-[#602AEA]/20 outline-none transition"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#141033]">Message</label>
            <textarea 
              rows={4}
              placeholder="Write your message here..." 
              className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:border-[#602AEA] focus:ring-2 focus:ring-[#602AEA]/20 outline-none transition resize-none"
            />
          </div>

          {/* Send Button */}
          <button 
            type="button"
            className="h-[50px] mt-2 rounded-xl bg-[#330E78] text-white font-bold text-sm hover:bg-[#4E1FC3] transition shadow-lg shadow-[#602AEA]/20 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-paper-plane"></i> Send Message
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap justify-center gap-15 text-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-50 text-[#602AEA] flex items-center justify-center">
            <i className="fa-solid fa-envelope"></i>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Email</p>
            <p className="text-sm font-semibold text-[#141033]">learnxchange@gmail.com</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-50 text-[#602AEA] flex items-center justify-center">
            <i className="fa-solid fa-phone"></i>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Phone</p>
            <p className="text-sm font-semibold text-[#141033]">+20 1557974617</p>
          </div>
        </div>
      </div>

    </div>
  );
}