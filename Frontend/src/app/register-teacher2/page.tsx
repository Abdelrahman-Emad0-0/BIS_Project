"use client";

import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { professionalBioSchema, ProfessionalBioFormData } from "@/schema/RegisterTeacher2";
import { useRouter } from "next/navigation";

export default function RegisterTeacherStep2() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfessionalBioFormData>({
    resolver: zodResolver(professionalBioSchema),
  });

  const onSubmit = async (data: ProfessionalBioFormData) => {
    try {
      const token = localStorage.getItem("token");
      await api.post("/teacher/bio", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/register-teacher3");
    } catch (error) {
      alert("حدث خطأ، يرجى التأكد من البيانات والاتصال.");
    }
  };
  const cardClass = "bg-[#233557] border border-white/10 rounded-2xl p-8 flex flex-col h-full";
  const inputClass = "w-full bg-[#1B2F57] border border-white/10 rounded-lg p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <main className="min-h-screen w-full bg-[#1A2E5A] p-6 md:p-12 flex flex-col items-center">
      <h1 className="text-white text-4xl font-bold mb-12 font-serif">Professional BIO</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Experience */}
          <div className={cardClass}>
            <h2 className="text-white text-lg font-semibold mb-6">Experience</h2>
            <label className="block text-white mb-2 text-sm">Years & Details</label>
            <textarea {...register("experience")} className={`${inputClass} h-64 resize-none`} placeholder="" />
            {errors.experience && <p className="text-red-400 text-xs mt-2">{errors.experience.message}</p>}
          </div>

          {/* Card 2: Qualifications */}
          <div className={cardClass}>
            <h2 className="text-white text-lg font-semibold mb-6">Qualifications</h2>
            <label className="block text-white mb-2 text-sm">Degrees</label>
            <textarea {...register("qualifications")} className={`${inputClass} h-64 resize-none`} placeholder="" />
            {errors.qualifications && <p className="text-red-400 text-xs mt-2">{errors.qualifications.message}</p>}
          </div>

          {/* Card 3: Short Bio */}
          <div className={cardClass}>
            <h2 className="text-white text-lg font-semibold mb-6">Public Profile</h2>
            <label className="block text-white mb-2 text-sm">Short Bio</label>
            <textarea {...register("bio")} className={`${inputClass} h-64 resize-none`} placeholder="" />
            {errors.bio && <p className="text-red-400 text-xs mt-2">{errors.bio.message}</p>}
          </div>
        </div>

        {/* زر الإرسال */}
        <div className="flex justify-end mt-10">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="px-10 py-3 bg-[#B4B6C1] text-black font-bold rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 text-white"
          >
            {isSubmitting ? "Saving..." : "Next"}
          </button>
        </div>
      </form>
    </main>
  );
}