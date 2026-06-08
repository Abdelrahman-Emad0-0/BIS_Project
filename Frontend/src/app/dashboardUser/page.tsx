"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const CAT_COLOR: Record<string, string> = {
  Programming: "bg-blue-900", Design: "bg-purple-900", Marketing: "bg-green-900",
  Languages: "bg-orange-900", "Data Science": "bg-indigo-900", Photography: "bg-pink-900",
};

export default function DashboardUserPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"learn" | "teach" | "exchange">("learn");

  useEffect(() => {
    api.get("/user/dashboard")
      .then((res) => { setData(res.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center text-[#602AEA] font-bold text-lg">Loading your dashboard...</div>;
  if (!data) return <div className="p-20 text-center text-red-500">Could not load dashboard.</div>;

  const { user, stats, continue_learning, my_teaching_courses, upcoming_sessions_list, recent_activity } = data;
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 w-full max-w-[1600px] mx-auto">

      {/* Top Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 flex flex-col gap-5">
          <div>
            <h1 className="text-3xl font-bold text-[#141033] flex items-center gap-2">
              {getGreeting()}, {firstName}! <span>👋</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              You're learning <strong className="text-[#141033]">{stats.enrolled_courses}</strong> courses
              {stats.teaching_courses > 0 && <> and teaching <strong className="text-[#141033]">{stats.teaching_courses}</strong> courses</>}.
            </p>
          </div>

          {/* Learn / Teach / Exchange tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            {(["learn","teach","exchange"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition capitalize flex items-center gap-2 ${tab===t?"bg-white shadow text-[#141033]":"text-gray-500 hover:text-[#141033]"}`}>
                <i className={`fa-solid ${t==="learn"?"fa-graduation-cap":t==="teach"?"fa-chalkboard-user":"fa-right-left"}`}></i>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {label:"Enrolled Courses", value:stats.enrolled_courses, sub:`${stats.in_progress} in progress`, icon:"fa-book-open", cls:"bg-purple-50 text-purple-600", href:"/dashboardUser/my-courses"},
              {label:"Teaching Courses", value:stats.teaching_courses, sub:`${stats.teaching_students} students`, icon:"fa-users", cls:"bg-green-50 text-green-600", href:"/dashboardUser/teach"},
              {label:"Exchange Matches", value:stats.exchange_matches, sub:`${stats.active_exchanges} active`, icon:"fa-right-left", cls:"bg-orange-50 text-orange-600", href:"/dashboardUser/exchange"},
              {label:"Upcoming Sessions", value:stats.upcoming_sessions, sub:`${stats.this_week_sessions} this week`, icon:"fa-clock", cls:"bg-blue-50 text-blue-600", href:"/dashboardUser/calendar"},
            ].map((c) => (
              <Link href={c.href} key={c.label}>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{c.label}</p>
                    <h3 className="text-2xl font-bold text-[#141033]">{c.value}</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">{c.sub}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.cls}`}>
                    <i className={`fa-solid ${c.icon}`}></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Daily Goal */}
        <div className="bg-gradient-to-br from-[#602AEA] to-[#9D50FF] rounded-3xl p-7 text-white flex flex-col justify-between relative overflow-hidden min-h-[220px]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div>
            <h3 className="font-bold text-xl mb-1">Daily Goal</h3>
            <p className="text-white/70 text-xs">Keep going! You're close to your goal 🎯</p>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-5xl font-bold">68%</div>
              <div className="w-36 h-2 bg-white/30 rounded-full mt-3">
                <div className="h-2 bg-white rounded-full" style={{width:"68%"}} />
              </div>
            </div>
            <Link href="/dashboardUser/rewards">
              <button className="bg-white text-[#602AEA] text-xs font-bold px-4 py-2 rounded-xl hover:bg-white/90 transition">
                View Progress
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Continue Learning */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-[#141033]">Continue Learning</h2>
            <Link href="/dashboardUser/my-courses" className="text-xs text-[#602AEA] font-bold">View all</Link>
          </div>
          {continue_learning.length > 0 ? continue_learning.map((c: any) => (
            <Link href={`/dashboardUser/course/${c.id}`} key={c.id}>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition flex gap-4 items-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0 ${CAT_COLOR[c.category]||"bg-gray-800"}`}>
                  {c.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#602AEA] bg-purple-50 px-2 py-0.5 rounded">{c.category}</span>
                  <h4 className="font-bold text-sm text-[#141033] mt-1 truncate">{c.title}</h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                      <div className="h-1.5 bg-[#602AEA] rounded-full" style={{width:`${c.progress||0}%`}} />
                    </div>
                    <span className="text-[10px] text-gray-500">{c.progress||0}%</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Next: {c.next_lesson}</p>
                </div>
                <button className="shrink-0 bg-[#602AEA] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">Continue</button>
              </div>
            </Link>
          )) : (
            <div className="bg-white rounded-2xl p-8 border text-center">
              <i className="fa-solid fa-book-open text-gray-200 text-4xl mb-3"></i>
              <p className="text-gray-400 text-sm mb-3">No active courses yet.</p>
              <Link href="/dashboardUser/exploreCourses">
                <button className="text-xs text-[#602AEA] font-bold">Browse courses →</button>
              </Link>
            </div>
          )}
        </div>

        {/* My Teaching Courses */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-[#141033]">My Teaching Courses</h2>
            <Link href="/dashboardUser/teach" className="text-xs text-[#602AEA] font-bold">View all</Link>
          </div>
          {my_teaching_courses.length > 0 ? my_teaching_courses.map((c: any) => (
            <div key={c.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-4 items-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0 ${CAT_COLOR[c.category]||"bg-gray-800"}`}>
                {c.title.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-[#141033] truncate">{c.title}</h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  {c.students} Students
                  {c.avg_rating > 0 && <span className="ml-2 text-yellow-500">★ {c.avg_rating}</span>}
                </p>
              </div>
              <button className="shrink-0 border border-gray-200 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50">Manage</button>
            </div>
          )) : (
            <div className="bg-white rounded-2xl p-8 border text-center">
              <i className="fa-solid fa-chalkboard text-gray-200 text-4xl mb-3"></i>
              <p className="text-gray-400 text-sm">No teaching courses yet.</p>
            </div>
          )}
        </div>

        {/* Upcoming Sessions + Recent Activity */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-[#141033]">Upcoming Sessions</h2>
            <Link href="/dashboardUser/calendar" className="text-xs text-[#602AEA] font-bold">View calendar</Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {upcoming_sessions_list.length > 0 ? upcoming_sessions_list.map((s: any) => (
              <div key={s.id} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0">
                <div className="text-center shrink-0 w-10">
                  <p className="text-[10px] font-bold text-[#602AEA] uppercase">{s.month}</p>
                  <p className="text-xl font-bold text-[#141033] leading-none">{s.day}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#141033] truncate">{s.title||"Session"}</p>
                  <p className="text-[10px] text-gray-400">With {s.with_name} • {s.time}</p>
                </div>
                <button className="shrink-0 bg-[#602AEA] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#5022C0]">Join</button>
              </div>
            )) : (
              <div className="p-6 text-center text-gray-400 text-sm">No upcoming sessions.</div>
            )}
          </div>

          <h2 className="font-bold text-[#141033]">Recent Activity</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {recent_activity.length > 0 ? recent_activity.map((a: any) => (
              <div key={a.id} className="flex items-start gap-3 p-4 border-b border-gray-50 last:border-0">
                <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
                  <i className="fa-solid fa-bell text-[#602AEA] text-[10px]"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#141033] line-clamp-2">{a.message||a.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{a.time_ago}</p>
                </div>
              </div>
            )) : (
              <div className="p-6 text-center text-gray-400 text-sm">No recent activity.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
