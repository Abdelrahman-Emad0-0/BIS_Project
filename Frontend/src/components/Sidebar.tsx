"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        setUserRole(u?.role ?? null);
      }
    } catch {}
  }, []);

  const canTeach = userRole === "teacher" || userRole === "both";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const getLinkClass = (path: string) => {
    return pathname === path
      ? "flex items-center gap-4 px-4 py-3 bg-[#602AEA] text-white rounded-xl shadow-lg shadow-[#602AEA]/30 transition"
      : "flex items-center gap-4 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition";
  };
  const getSubLinkClass = (path: string) => {
    return pathname === path
      ? "flex items-center gap-4 px-4 py-2 ml-8 text-[#A274FF] transition border-l border-[#A274FF]"
      : "flex items-center gap-4 px-4 py-2 ml-8 text-white/50 hover:text-white transition border-l border-white/10";
  };

  return (
    <aside className="w-[280px] h-screen bg-[#141033] flex flex-col justify-between overflow-y-auto custom-scrollbar sticky top-0 hidden lg:flex border-r border-white/5 shadow-2xl z-50">
      
      {/* Top Section */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9D50FF] to-[#602AEA] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#602AEA]/50">
            X
          </div>
          <div>
            <h1 className="text-white text-lg font-bold tracking-wide">Learn X Change</h1>
            <p className="text-white/50 text-[10px]">Learn. Teach. Exchange.</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          <Link href="/dashboardUser" className={getLinkClass("/dashboardUser")}>
            <i className="fa-solid fa-house w-5 text-center"></i>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>

          <Link href="/dashboardUser/my-courses" className={getLinkClass("/dashboardUser/my-courses")}>
            <i className="fa-solid fa-book-open w-5 text-center"></i>
            <span className="text-sm font-medium">My Courses</span>
          </Link>

          <Link href="/dashboardUser/exploreCourses" className={getLinkClass("/dashboardUser/exploreCourses")}>
            <i className="fa-solid fa-chalkboard-user w-5 text-center"></i>
            <span className="text-sm font-medium">Explore Courses</span>
          </Link>
            
          {/* Teach Section — only for teacher / both roles */}
          {canTeach && (
            <div className="flex flex-col gap-1 mt-2 mb-2">
              <Link href="/dashboardUser/teach" className={getLinkClass("/dashboardUser/teach")}>
                <i className="fa-solid fa-chalkboard-user w-5 text-center"></i>
                <span className="text-sm font-medium">Teach (My Courses)</span>
              </Link>

              <Link href="/dashboardUser/create-course" className={getSubLinkClass("/dashboardUser/create-course")}>
                <i className="fa-solid fa-pen w-5 text-center text-[10px]"></i>
                <span className="text-xs font-medium">Basic Information</span>
              </Link>

              <Link href="/dashboardUser/create-course/curriculum" className={getSubLinkClass("/dashboardUser/create-course/curriculum")}>
                <i className="fa-solid fa-list-check w-5 text-center text-[10px]"></i>
                <span className="text-xs font-medium">Course Curriculum</span>
              </Link>

              <Link href="/dashboardUser/create-course/pricing" className={getSubLinkClass("/dashboardUser/create-course/pricing")}>
                <i className="fa-solid fa-tag w-5 text-center text-[10px]"></i>
                <span className="text-xs font-medium">Course Pricing</span>
              </Link>

              <Link href="/dashboardUser/create-course/preview-publish" className={getSubLinkClass("/dashboardUser/create-course/preview-publish")}>
                <i className="fa-solid fa-upload w-5 text-center text-[10px]"></i>
                <span className="text-xs font-medium">Preview & Publish</span>
              </Link>
            </div>
          )}

          <Link href="/dashboardUser/exchange" className={getLinkClass("/dashboardUser/exchange")}>
            <i className="fa-solid fa-right-left w-5 text-center"></i>
            <span className="text-sm font-medium">Exchange</span>
          </Link>

          <Link href="/dashboardUser/message" className="flex items-center justify-between px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition">
            <div className="flex items-center gap-4">
              <i className="fa-regular fa-message w-5 text-center"></i>
              <span className="text-sm font-medium">Messages</span>
            </div>
          
          </Link>

          <Link href="/dashboardUser/notifications" className="flex items-center justify-between px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition">
            <div className="flex items-center gap-4">
              <i className="fa-regular fa-bell w-5 text-center"></i>
              <span className="text-sm font-medium">Notifications</span>
            </div>
           
          </Link>

          <Link href="/dashboardUser/calendar" className={getLinkClass("/dashboardUser/calendar")}>
            <i className="fa-regular fa-calendar w-5 text-center"></i>
            <span className="text-sm font-medium">Calendar</span>
          </Link>

          <Link href="/dashboardUser/rewards" className={getLinkClass("/dashboardUser/rewards")}>
            <i className="fa-solid fa-gift w-5 text-center"></i>
            <span className="text-sm font-medium">Rewards</span>
          </Link>

          <Link href="/dashboardUser/profile" className={getLinkClass("/dashboardUser/profile")}>
            <i className="fa-regular fa-user w-5 text-center"></i>
            <span className="text-sm font-medium">Profile</span>
          </Link>

          <Link href="/dashboardUser/settings" className={getLinkClass("/dashboardUser/settings")}>
            <i className="fa-solid fa-gear w-5 text-center"></i>
            <span className="text-sm font-medium">Settings</span>
          </Link>

          {/* زر الخروج المضاف في آخر القائمة */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 mt-4 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-xl transition w-full"
          >
            <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}