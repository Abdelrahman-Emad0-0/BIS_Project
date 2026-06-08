"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const load = () => {
    api.get("/courses")
      .then(res => {
        const list = res.data.courses || res.data || [];
        setCourses(list); setFiltered(list); setLoading(false);
      })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    let f = courses;
    if (catFilter !== "all") f = f.filter((c:any) => c.category === catFilter);
    if (search) f = f.filter((c:any) => c.title?.toLowerCase().includes(search.toLowerCase()) || c.teacher_name?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(f);
  }, [search, catFilter, courses]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    try { await api.delete(`/courses/${id}`); load(); } catch(e:any) { alert(e.response?.data?.message||"Failed"); }
  };

  const categories = [...new Set(courses.map((c:any) => c.category).filter(Boolean))];
  const totalStudents = courses.reduce((s:number, c:any) => s + (c.students_count||c.enrollments_count||0), 0);

  if (loading) return <div className="p-20 text-center text-[#602AEA] font-bold">Loading courses...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E4B]">Courses</h1>
          <p className="text-gray-500 text-sm">Manage all platform courses.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total Courses",  value: courses.length,  icon:"fa-book-open",   color:"bg-purple-50 text-purple-600" },
          { label:"Free Courses",   value: courses.filter((c:any)=>Number(c.price)===0).length, icon:"fa-gift", color:"bg-green-50 text-green-600" },
          { label:"Paid Courses",   value: courses.filter((c:any)=>Number(c.price)>0).length,   icon:"fa-circle-dollar-to-slot", color:"bg-yellow-50 text-yellow-600" },
          { label:"Categories",     value: categories.length, icon:"fa-tags",      color:"bg-blue-50 text-blue-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div><p className="text-xs text-gray-500">{s.label}</p><h3 className="text-2xl font-bold text-[#1E1E4B] mt-0.5">{s.value}</h3></div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><i className={`fa-solid ${s.icon}`}></i></div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap gap-3 mb-5">
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#602AEA]">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <div className="flex-1 min-w-[200px] flex items-center border border-gray-200 rounded-xl px-4 py-2 gap-2">
            <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by course name or instructor..." className="flex-1 text-sm outline-none" />
          </div>
          <span className="text-xs text-gray-400 self-center">{filtered.length} courses</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b border-gray-100">
                <th className="pb-3 text-left font-medium">Course</th>
                <th className="pb-3 text-left font-medium">Instructor</th>
                <th className="pb-3 text-left font-medium">Category</th>
                <th className="pb-3 text-right font-medium">Price</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c:any) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#602AEA] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {c.title?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#1E1E4B] truncate max-w-[180px]">{c.title}</p>
                        <p className="text-[10px] text-gray-400">{c.duration||'—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-gray-500 text-xs">{c.teacher_name||c.teacher?.name||'—'}</td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded">{c.category}</span>
                  </td>
                  <td className="py-3 text-right font-bold text-[#1E1E4B]">
                    {Number(c.price)===0 ? <span className="text-green-600">Free</span> : `EGP ${Number(c.price).toLocaleString()}`}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboardUser/course/${c.id}`}>
                        <button className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-100">
                          <i className="fa-solid fa-eye text-xs"></i>
                        </button>
                      </Link>
                      <button onClick={() => handleDelete(c.id)}
                        className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100">
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan={5} className="py-10 text-center text-gray-400">No courses found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
