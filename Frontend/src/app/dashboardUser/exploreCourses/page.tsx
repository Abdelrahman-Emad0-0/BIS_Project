"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function ExploreCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch enrolled course IDs so we can mark them
    api.post("/my-courses/enrolled")
      .then((res) => {
        const ids = (res.data.data || []).map((e: any) => e.course?.id || e.course_id);
        setEnrolledIds(new Set(ids));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedCategory) params.set("category", selectedCategory);

    api.get(`/explore/courses?${params.toString()}`)
      .then((res) => { setCourses(res.data.courses || []); setLoading(false); })
      .catch(() => { setCourses([]); setLoading(false); });
  }, [search, selectedCategory]);

  useEffect(() => {
    api.get("/explore/categories")
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const isFree = (price: any) => Number(price) === 0;

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 w-full max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Courses</h1>
        <p className="text-gray-500 text-sm">Discover and enroll in courses to learn new skills.</p>
      </div>

      <div className="flex gap-8 items-start">
        <div className="flex-1 min-w-0">
          <div className="mb-6 bg-white rounded-full px-4 py-3 border border-gray-200 shadow-sm flex items-center">
            <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
            <input onChange={(e) => setSearch(e.target.value)} value={search}
              placeholder="Search courses by title..." className="bg-transparent outline-none w-full text-sm" />
          </div>

          {loading ? (
            <div className="text-center py-20 text-[#602AEA] font-bold">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No courses found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course: any) => {
                const isEnrolled = enrolledIds.has(course.id);
                return (
                  <Link href={`/dashboardUser/course/${course.id}`} key={course.id}>
                    <div className={`bg-white rounded-2xl p-4 border shadow-sm hover:shadow-md transition cursor-pointer relative ${isEnrolled ? "border-[#602AEA]/30" : ""}`}>
                      {isEnrolled && (
                        <div className="absolute top-3 right-3 bg-[#602AEA] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                          ✓ Enrolled
                        </div>
                      )}
                      <div className="w-full h-36 rounded-xl mb-4 bg-indigo-900 flex items-center justify-center text-white font-bold text-3xl">
                        {course.title?.charAt(0) || "C"}
                      </div>
                      <h3 className="font-bold text-[15px] mb-1 truncate">{course.title}</h3>
                      <p className="text-xs text-gray-500 mb-1">{course.teacher_name}</p>
                      <p className="text-xs text-purple-600 font-semibold mb-3">{course.category}</p>
                      <div className="flex justify-between items-center border-t pt-3">
                        {isFree(course.price)
                          ? <span className="font-bold text-green-600">Free</span>
                          : <span className="font-bold text-gray-900">EGP {Number(course.price).toLocaleString()}</span>
                        }
                        {isEnrolled
                          ? <span className="text-[10px] text-[#602AEA] font-bold">Continue →</span>
                          : isFree(course.price)
                            ? <span className="text-[10px] text-green-600 font-bold">Enroll Free</span>
                            : <span className="text-[10px] text-gray-400">Enroll Now</span>
                        }
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="w-64 shrink-0">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Categories</h2>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm cursor-pointer" onClick={() => setSelectedCategory("")}>
                <span className={selectedCategory === "" ? "text-[#602AEA] font-bold" : "text-gray-700 hover:text-[#602AEA]"}>All Categories</span>
              </li>
              {categories.map((cat: any, idx) => (
                <li key={idx} onClick={() => setSelectedCategory(cat.category)}
                  className="flex justify-between items-center text-sm cursor-pointer">
                  <span className={selectedCategory === cat.category ? "text-[#602AEA] font-bold" : "text-gray-700 hover:text-[#602AEA]"}>{cat.category}</span>
                  <span className="text-xs text-gray-400">{cat.total}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
