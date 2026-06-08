"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerChangeSchema2, RegisterChangeSchemaType2 } from "@/schema/registerChangeSchema2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function RegisterChange2() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterChangeSchemaType2>({
    resolver: zodResolver(registerChangeSchema2),
  });

  const onSubmit = async (data: RegisterChangeSchemaType2) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("skills_offered[]", data.skills_offered);
      formData.append("skills_wanted[]", data.skills_wanted);
      formData.append("payment_method", data.payment_method || "bank_transfer");
      if (data.id_document?.[0]) formData.append("id_document", data.id_document[0]);

      await api.post("/exchange/profile-setup", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      router.push("/terms-change");
    } catch (error) {
      alert("حدث خطأ أثناء التسجيل");
    }
  };

  const skillOptions = [
    { value: "Front-End", label: "Front-End" },
    { value: "Back-End", label: "Back-End" },
    { value: "Graphic Design", label: "Graphic Design" },
    { value: "Data Analysis", label: "Data Analysis" },
    { value: "English", label: "English" }
  ];

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-[#1A2E5A] to-[#2D0E4A] flex flex-col items-center justify-center px-6 py-12 relative">
      <Link href="/register-change" className="absolute top-8 left-8 text-white text-3xl hover:opacity-80 transition"><i className="fa-solid fa-chevron-left"></i></Link>

      <h1 className="text-white text-4xl font-bold mb-16 tracking-wide">Your Skill Exchange</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
          
          {/* Card 1: Offer */}
          <div className="relative rounded-2xl  border border-[#ff00ff]/40 p-10 h-[450px] flex flex-col items-center justify-center shadow-[0_0_25px_rgba(255,0,255,0.15)]">
            <i className="fa-regular fa-lightbulb text-[#ff00ff] text-5xl mb-8"></i>
            <h3 className="text-white text-2xl font-bold mb-12 text-center">Skills To Offer<br/><span className="text-sm font-normal opacity-60">(Teach)</span></h3>
            <select {...register("skills_offered")} className="w-full h-[55px] rounded-xl  text-black px-4 border border-white/20 outline-none cursor-pointer">
              <option value="">Select a skill...</option>
              {skillOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            {errors.skills_offered && <p className="text-red-400 mt-3 text-sm">{errors.skills_offered.message}</p>}
          </div>

          {/* Card 2: Master */}
          <div className="relative rounded-2xl  border border-[#00ffff]/40 p-10 h-[450px] flex flex-col items-center justify-center shadow-[0_0_25px_rgba(0,255,255,0.15)]">
            <i className="fa-solid fa-magnifying-glass text-[#00ffff] text-5xl mb-8"></i>
            <h3 className="text-white text-2xl font-bold mb-12 text-center">Skills To Master<br/><span className="text-sm font-normal opacity-60">(Learn)</span></h3>
            <select {...register("skills_wanted")} className="w-full h-[55px] rounded-xl  text-black px-4 border border-white/20 outline-none cursor-pointer">
              <option value="">Select a skill...</option>
              {skillOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            {errors.skills_wanted && <p className="text-red-400 mt-3 text-sm">{errors.skills_wanted.message}</p>}
          </div>

          {/* Card 3: Docs & Payment */}
          <div className="flex flex-col gap-6">
            <label className="border-2 border-dashed border-white/30 rounded-2xl h-[280px] flex flex-col items-center justify-center text-white cursor-pointer hover:bg-white/5 transition">
              <i className="fa-solid fa-cloud-arrow-up text-5xl mb-5"></i>
              <p className="text-center px-4">Identity verification documents<br/><span className="text-xs opacity-50 mt-2 block">(For Teaching Role)</span></p>
              <input type="file" {...register("id_document")} className="hidden" />
            </label>
            {errors.id_document && <p className="text-red-400 text-sm -mt-4">{errors.id_document.message?.toString()}</p>}
            
            <select {...register("payment_method")} className="w-full rounded-xl  border border-white/20 p-5 text-white cursor-pointer">
              <option value="bank_transfer">Bank Transfer</option>
             
            </select>
          </div>
        </div>

     <button 
  type="submit" 
  className="w-full max-w-4xl h-[70px] text-white text-xl font-bold rounded-full 
             bg-gradient-to-r from-[#ff00ff]/20 to-[#00ffff]/20 
             border border-white/20 
             shadow-[0_0_20px_rgba(255,0,255,0.3),0_0_20px_rgba(0,255,255,0.3)] 
             hover:shadow-[0_0_30px_rgba(255,0,255,0.5),0_0_30px_rgba(0,255,255,0.5)] 
             transition-all duration-300"
>
  {isSubmitting ? "Finishing..." : "Finish"}
</button>
      </form>
    </section>
  );
}