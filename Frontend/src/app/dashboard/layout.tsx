"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (!token) { router.push("/login"); return; }
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u.role !== "admin") { router.push("/dashboardUser"); return; }
        setUser(u);
      } catch {}
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard",               icon: "fa-house",              label: "Dashboard" },
    { href: "/dashboard/users",         icon: "fa-users",              label: "Users" },
    { href: "/dashboard/courses",       icon: "fa-book-open",          label: "Courses" },
    { href: "/dashboard/payments",      icon: "fa-credit-card",        label: "Payments" },
    { href: "/dashboard/reports",       icon: "fa-flag",               label: "Reports" },
    { href: "/dashboard/reviews",       icon: "fa-star",               label: "Reviews" },
    { href: "/dashboard/notifications", icon: "fa-bell",               label: "Notifications" },
  ];

  const getLinkClass = (href: string) =>
    pathname === href
      ? "flex items-center gap-4 px-4 py-3 bg-white/15 text-white rounded-xl shadow transition font-bold"
      : "flex items-center gap-4 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition";

  const initials = user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0,2) || "A";

  return (
    <div className="flex h-screen w-full bg-[#F6F7FA] overflow-hidden font-sans">

      {/* Sidebar — same structure as user sidebar */}
      <aside className="w-[260px] h-screen bg-[#141033] flex flex-col justify-between overflow-y-auto sticky top-0 hidden lg:flex border-r border-white/5 shadow-2xl z-50 shrink-0">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-2 pl-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9D50FF] to-[#602AEA] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              X
            </div>
            <div>
              <h1 className="text-white text-lg font-bold tracking-wide">Learn X Change</h1>
              <p className="text-white/40 text-[10px]">Admin Panel</p>
            </div>
          </div>

          <div className="border-b border-white/10 mb-6 mt-4"></div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ href, icon, label }) => (
              <Link key={href} href={href} className={getLinkClass(href)}>
                <i className={`fa-solid ${icon} w-5 text-center`}></i>
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom: user info + logout */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#602AEA] text-white flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
            <div>
              <p className="text-white text-sm font-bold">{user?.name || "Admin"}</p>
              <p className="text-white/40 text-[10px] capitalize">{user?.role || "admin"}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-xl transition w-full text-sm font-medium">
            <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="w-full h-[72px] bg-white px-6 lg:px-8 flex items-center justify-between border-b border-gray-200/60 sticky top-0 z-40 shrink-0">
          <div className="relative w-full max-w-[400px] hidden sm:block">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input type="text" placeholder="Search anything..."
              className="w-full h-[40px] rounded-full bg-gray-50 border border-gray-200 pl-10 pr-4 text-sm outline-none focus:border-[#602AEA]" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#602AEA] text-white flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
            <div className="hidden md:block">
              <p className="text-[#141033] text-sm font-bold">{user?.name || "Admin"}</p>
              <p className="text-gray-400 text-[11px]">Super Admin</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
