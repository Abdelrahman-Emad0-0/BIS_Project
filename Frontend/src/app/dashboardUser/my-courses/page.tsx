"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب الكورسات المسجل فيها المستخدم من الـ Backend
    api.post("/my-courses/enrolled") 
      .then((res) => {
        setCourses(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 w-full max-w-[1600px] mx-auto">
      
      {/* 1. Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-[#141033] mb-2">My Courses</h1>
        <p className="text-gray-500 text-sm">All the courses you're learning and teaching.</p>
      </div>

      {/* 2. Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 w-full overflow-x-auto custom-scrollbar">
        <button className="text-[#602AEA] border-b-2 border-[#602AEA] pb-3 font-bold text-sm shrink-0 flex items-center gap-2">
          <i className="fa-solid fa-book-open"></i> Enrolled Courses
        </button>
        {/* يمكنك إضافة onClick لكل زر لتبديل الحالة (Enrolled, Teaching, Completed, Wishlist) */}
      </div>

      {/* 4. Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Left Side: Courses List */}
        <div className="xl:col-span-3 flex flex-col gap-4 min-w-0">
          {loading ? (
            <div className="p-10 text-center">Loading your courses...</div>
          ) : courses.length > 0 ? (
            courses.map((item: any) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-5 md:gap-6 items-start md:items-center hover:shadow-md transition">
                
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-500 flex justify-center items-center text-2xl shrink-0">
                  <i className="fa-solid fa-book"></i>
                </div>

                {/* Title & Progress */}
                <div className="flex-1 min-w-0 w-full">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md inline-block text-purple-600 bg-purple-50">
                    {item.course.category || "General"}
                  </span>
                  <h3 className="font-bold text-[#141033] mt-2 text-base truncate">{item.course.title}</h3>
                  <p className="text-xs text-gray-500 truncate mt-1">Instructor: {item.course.teacher?.name || "N/A"}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#602AEA]" style={{ width: `${item.progress}%` }}></div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium shrink-0">{item.progress}% Complete</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end mt-4 md:mt-0">
                  <button className="bg-[#602AEA] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#4E1FC3] shadow-md shadow-[#602AEA]/20 transition w-full md:w-auto">
                    Continue Learning
                  </button>
                </div>

              </div>
            ))
          ) : (
            <p className="p-10 text-center text-gray-500">No enrolled courses found.</p>
          )}
        </div>

       
        <div className="xl:col-span-1 flex flex-col gap-6 min-w-0">
           
        </div>
      </div>
    </div>
  );
}