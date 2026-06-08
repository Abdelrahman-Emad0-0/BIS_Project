"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

const ROLE_BADGE: Record<string, string> = {
  learner: "bg-blue-50 text-blue-600",
  teacher: "bg-purple-50 text-purple-600",
  both:    "bg-green-50 text-green-600",
  admin:   "bg-red-50 text-red-600",
};

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard")
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center text-[#602AEA] font-bold">Loading dashboard...</div>;
  if (!data) return <div className="p-10 text-center text-red-500">Failed to load data.</div>;

  const { stats, recent_activities, revenue_chart, latest_users, recent_courses, recent_reports } = data;

  const statCards = [
    { label: "Total Students",    value: stats.total_students,    sub: `+${stats.new_students_week} this week`,  icon: "fa-user-graduate",         color: "bg-blue-50 text-blue-600",   link: "/dashboard/users" },
    { label: "Total Teachers",    value: stats.total_teachers,    sub: `+${stats.new_teachers_week} this week`,  icon: "fa-chalkboard-user",       color: "bg-green-50 text-green-600", link: "/dashboard/users" },
    { label: "Total Courses",     value: stats.total_courses,     sub: `+${stats.new_courses_week} this week`,   icon: "fa-book-open",             color: "bg-purple-50 text-purple-600",link: "/dashboard/courses" },
    { label: "Total Enrollments", value: stats.total_enrollments, sub: "All time",                               icon: "fa-users",                 color: "bg-orange-50 text-orange-600",link: "/dashboard/courses" },
    { label: "Revenue",           value: `EGP ${Number(stats.total_revenue).toLocaleString()}`, sub: `+EGP ${Number(stats.revenue_week).toLocaleString()} this week`, icon: "fa-circle-dollar-to-slot", color: "bg-yellow-50 text-yellow-600", link: "/dashboard/payments" },
  ];

  const maxRev = Math.max(...(revenue_chart || []).map((d: any) => d.amount), 1);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-[#141033]">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin! Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {statCards.map((c) => (
          <Link href={c.link} key={c.label}>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">{c.label}</p>
                <h3 className="text-2xl font-bold text-[#141033]">{c.value}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">{c.sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
                <i className={`fa-solid ${c.icon}`}></i>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-[#141033]">Recent Activities</h2>
            <span className="text-xs text-[#602AEA] font-bold cursor-pointer">View All</span>
          </div>
          <div className="flex flex-col gap-4">
            {(recent_activities || []).map((a: any, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${a.color}`}>
                  <i className={`fa-solid ${a.icon} text-xs`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#141033] line-clamp-2">{a.message}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{a.ago}</p>
                </div>
              </div>
            ))}
            {(!recent_activities || recent_activities.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">No recent activity.</p>
            )}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-[#141033]">Revenue Overview</h2>
            <span className="text-xs text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg">This Week</span>
          </div>
          <div className="flex items-end gap-2 h-36 px-2">
            {(revenue_chart || []).map((d: any, i: number) => {
              const h = maxRev > 0 ? Math.max(8, Math.round((d.amount / maxRev) * 100)) : 8;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full">
                    {d.amount > 0 && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#141033] text-white text-[9px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                        EGP {d.amount}
                      </div>
                    )}
                    <div className="w-full bg-gradient-to-t from-[#602AEA] to-[#9D50FF] rounded-t-lg"
                      style={{ height: `${h}%`, minHeight: "8px" }}></div>
                  </div>
                  <span className="text-[10px] text-gray-400">{d.day}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
            <p className="text-xs text-gray-500">Total this week</p>
            <p className="font-bold text-[#602AEA]">EGP {Number(stats.revenue_week).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Latest Users */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-[#141033]">Latest Users</h2>
            <Link href="/dashboard/users" className="text-xs text-[#602AEA] font-bold hover:underline">View All</Link>
          </div>
          <div className="flex flex-col gap-3">
            {(latest_users || []).map((u: any) => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#602AEA] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#141033] truncate">{u.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{u.email}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${ROLE_BADGE[u.role] || "bg-gray-50 text-gray-500"}`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-[#141033]">Recent Courses</h2>
            <Link href="/dashboard/courses" className="text-xs text-[#602AEA] font-bold hover:underline">View All</Link>
          </div>
          <div className="flex flex-col gap-3">
            {(recent_courses || []).map((c: any) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {c.title?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#141033] truncate">{c.title}</p>
                  <p className="text-[10px] text-[#602AEA]">{c.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-[#141033]">{c.students}</p>
                  <p className="text-[9px] text-gray-400">students</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-[#141033]">Recent Reports</h2>
            <Link href="/dashboard/reports" className="text-xs text-[#602AEA] font-bold hover:underline">View All</Link>
          </div>
          <div className="flex flex-col gap-3">
            {(recent_reports || []).length === 0 ? (
              <div className="py-8 text-center">
                <i className="fa-solid fa-flag text-gray-200 text-3xl mb-2"></i>
                <p className="text-gray-400 text-xs">No reports yet.</p>
              </div>
            ) : (recent_reports || []).map((r: any) => (
              <div key={r.id} className="flex items-start gap-3 p-3 bg-red-50/50 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-flag text-[10px]"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#141033] truncate">{r.reason || "Report submitted"}</p>
                  <p className="text-[10px] text-gray-400">by {r.user?.name || "User"}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${r.status === "open" ? "bg-red-50 text-red-600" : r.status === "resolved" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                  {r.status || "open"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
