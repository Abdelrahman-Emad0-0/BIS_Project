"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Show something immediately from localStorage (fast)
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }

    // 2. Fetch fresh data from API (authoritative)
    const token = localStorage.getItem("token");
    if (!token) return;

    api.get("/profile")
      .then((res) => {
        const fresh = res.data.data;
        if (fresh) {
          setUser(fresh);
          // Keep localStorage in sync with real DB data
          localStorage.setItem("user", JSON.stringify(fresh));
        }
      })
      .catch(() => {});
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.trim().split(/\s+/).map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "User";

  return (
    <>
      <header className="w-full h-[90px] bg-[#F8F9FA] px-6 lg:px-8 flex items-center justify-between border-b border-gray-200/60 sticky top-0 z-40">

        <div className="flex items-center gap-4 lg:gap-6 flex-1">
          <button onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-gray-500 text-2xl hover:text-gray-800 transition">
            <i className="fa-solid fa-bars"></i>
          </button>

          <div className="relative w-full max-w-[450px] hidden sm:block">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" placeholder="Search for courses, teachers or skills..."
              className="w-full h-[45px] rounded-full bg-white border border-gray-200 pl-11 pr-14 text-sm outline-none focus:border-[#602AEA] focus:ring-2 focus:ring-[#602AEA]/20 shadow-sm transition" />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 w-[38px] h-[38px] rounded-full bg-[#602AEA] text-white flex items-center justify-center hover:bg-[#4E1FC3] transition shadow-md">
              <i className="fa-solid fa-magnifying-glass text-sm"></i>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-4 lg:gap-5 border-r border-gray-300 pr-4 lg:pr-6">
            <button className="relative text-gray-500 hover:text-[#602AEA] transition text-lg lg:text-xl">
              <i className="fa-regular fa-comment-dots"></i>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#602AEA] flex items-center justify-center text-[9px] text-white font-bold border-2 border-[#F8F9FA]">3</span>
            </button>
            <button className="relative text-gray-500 hover:text-[#602AEA] transition text-lg lg:text-xl">
              <i className="fa-regular fa-bell"></i>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#602AEA] flex items-center justify-center text-[9px] text-white font-bold border-2 border-[#F8F9FA]">6</span>
            </button>
          </div>

          <Link href="/dashboardUser/profile" className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-[#602AEA] flex items-center justify-center text-white font-bold border-2 border-white shadow-sm text-sm shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="hidden md:block">
              <h5 className="text-[#141033] text-sm font-bold">{displayName}</h5>
              <p className="text-gray-500 text-[11px] capitalize">{user?.role || ""}</p>
            </div>
          </Link>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#141033] flex flex-col lg:hidden overflow-y-auto">
          <div className="p-6 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9D50FF] to-[#602AEA] flex items-center justify-center text-white text-xl font-bold shadow-lg">X</div>
              <h1 className="text-white text-lg font-bold tracking-wide">Learn X Change</h1>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-white text-3xl w-10 h-10 flex items-center justify-center">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <nav className="flex flex-col gap-2 p-6">
            {[
              ["/dashboardUser", "fa-house", "Dashboard"],
              ["/dashboardUser/my-courses", "fa-book-open", "My Courses"],
              ["/dashboardUser/exchange", "fa-right-left", "Exchange"],
              ["/dashboardUser/notifications", "fa-bell", "Notifications"],
              ["/dashboardUser/profile", "fa-user", "Profile"],
              ["/dashboardUser/settings", "fa-gear", "Settings"],
            ].map(([href, icon, label]) => (
              <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition">
                <i className={`fa-solid ${icon} w-5 text-center`}></i>
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
