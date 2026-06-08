"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

const CAT_COLOR: Record<string, string> = {
  Programming: "bg-blue-900", Design: "bg-purple-900", Marketing: "bg-green-900",
  Languages: "bg-orange-900", "Data Science": "bg-indigo-900", Photography: "bg-pink-900",
};

export default function TeachPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/teach/overview")
      .then((res) => { setData(res.data || null); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center text-[#602AEA] font-bold">Loading...</div>;

  const stats = data?.stats || {};
  const courses = data?.my_courses || [];
  const reviews = data?.recent_reviews || [];

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 w-full max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#141033]">Teach</h1>
          <p className="text-gray-500 text-sm">Manage your courses and track your teaching performance.</p>
        </div>
        <Link href="/dashboardUser/create-course">
          <button className="bg-[#602AEA] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#5022C0] transition flex items-center gap-2">
            <i className="fa-solid fa-plus"></i> Create New Course
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total Courses",  value: stats.total_courses  ?? 0, icon:"fa-book",       color:"bg-purple-50 text-purple-600" },
          { label:"Total Students", value: stats.total_students ?? 0, icon:"fa-users",      color:"bg-blue-50 text-blue-600" },
          { label:"Avg Rating",     value: stats.average_rating ?? "—", icon:"fa-star",    color:"bg-yellow-50 text-yellow-600" },
          { label:"Total Earnings", value: `EGP ${(stats.total_earnings||0).toLocaleString()}`, icon:"fa-wallet", color:"bg-green-50 text-green-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <h3 className="text-2xl font-bold text-[#141033]">{s.value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <i className={`fa-solid ${s.icon}`}></i>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* My Courses */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <h2 className="font-bold text-[#141033]">My Courses</h2>
          {courses.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border text-center">
              <i className="fa-solid fa-chalkboard text-gray-200 text-5xl mb-4"></i>
              <h3 className="font-bold text-lg text-[#141033] mb-2">No courses yet</h3>
              <p className="text-gray-500 text-sm mb-4">Create your first course and start teaching!</p>
              <Link href="/dashboardUser/create-course">
                <button className="bg-[#602AEA] text-white px-6 py-3 rounded-xl font-bold">+ Create Course</button>
              </Link>
            </div>
          ) : courses.map((c: any) => (
            <div key={c.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0 ${CAT_COLOR[c.category]||"bg-gray-800"}`}>
                  {c.title?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-[#141033] truncate">{c.title}</h3>
                    <span className="text-[10px] bg-purple-50 text-purple-600 font-bold px-2 py-0.5 rounded">{c.category}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span><i className="fa-solid fa-users mr-1"></i>{c.students ?? 0} students</span>
                    {c.avg_rating > 0 && <span className="text-yellow-500"><i className="fa-solid fa-star mr-1"></i>{c.avg_rating}</span>}
                    <span className="font-bold text-[#602AEA]">EGP {Number(c.price||0).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href={`/dashboardUser/course/${c.id}`}>
                    <button className="border border-gray-200 text-xs font-bold px-3 py-2 rounded-lg hover:bg-gray-50">View</button>
                  </Link>
                  <Link href={`/dashboardUser/create-course?edit=${c.id}`}>
                    <button className="bg-[#602AEA] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#5022C0]">Edit</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Reviews */}
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-[#141033]">Recent Reviews</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {reviews.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No reviews yet.</div>
            ) : reviews.map((r: any) => (
              <div key={r.id} className="p-4 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                    {r.user?.name?.charAt(0) || "U"}
                  </div>
                  <p className="text-xs font-bold text-[#141033]">{r.user?.name || "Student"}</p>
                  <div className="ml-auto text-yellow-400 text-[10px]">{"★".repeat(r.rating||5)}</div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{r.comment || "Great course!"}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#141033] mb-3">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              {[
                { href:"/dashboardUser/create-course", icon:"fa-plus", label:"Create New Course" },
                { href:"/dashboardUser/calendar", icon:"fa-calendar", label:"Schedule a Session" },
                { href:"/dashboardUser/profile", icon:"fa-user", label:"Update Your Profile" },
              ].map(a => (
                <Link key={a.label} href={a.href}>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#602AEA] flex items-center justify-center">
                      <i className={`fa-solid ${a.icon} text-sm`}></i>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{a.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
