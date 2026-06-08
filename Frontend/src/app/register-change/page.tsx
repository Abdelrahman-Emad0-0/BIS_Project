"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchemaExchange, RegisterSchemaTypeExchange } from "@/schema/registerChangeSchema";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api"; 

export default function RegisterChange() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaTypeExchange>({
    resolver: zodResolver(registerSchemaExchange),
  });

  const onSubmit = async (data: RegisterSchemaTypeExchange) => {
    try {
     
      const response = await api.post("/exchange/account-info", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.confirmPassword, 
        gender: data.gender,
      });

  
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

    
      router.push("/register-change2");
    } catch (error: any) {
      console.error("API Error Details:", error.response?.data);
     
      alert(error.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً.");
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#1A2E5A] to-[#2D0E4A] relative overflow-hidden px-4 py-10">
      <div className="absolute top-6 left-6 text-white text-2xl cursor-pointer z-50">
        <Link href="/"><i className="fa-solid fa-chevron-left"></i></Link>
      </div>

      <div className="w-full max-w-3xl flex flex-col items-center">
        <h1 className="text-white text-3xl sm:text-4xl font-bold mb-14 font-serif tracking-wide">Create Your Account</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl flex flex-col gap-6">
          <input type="text" placeholder="Full Name" className="w-full h-[65px] rounded-xl bg-white/5 border border-white/20 px-14 text-white" {...register("name")} />
          {errors.name && <p className="text-red-400 text-sm -mt-4">{errors.name.message}</p>}

          <input type="email" placeholder="Email Address" className="w-full h-[65px] rounded-xl bg-white/5 border border-white/20 px-14 text-white" {...register("email")} />
          {errors.email && <p className="text-red-400 text-sm -mt-4">{errors.email.message}</p>}

          <input type="text" placeholder="Phone Number" className="w-full h-[65px] rounded-xl bg-white/5 border border-white/20 px-14 text-white" {...register("phone")} />
          {errors.phone && <p className="text-red-400 text-sm -mt-4">{errors.phone.message}</p>}

          <input type="password" placeholder="Password" className="w-full h-[65px] rounded-xl bg-white/5 border border-white/20 px-14 text-white" {...register("password")} />
          {errors.password && <p className="text-red-400 text-sm -mt-4">{errors.password.message}</p>}

          <input type="password" placeholder="Confirm Password" className="w-full h-[65px] rounded-xl bg-white/5 border border-white/20 px-14 text-white" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-red-400 text-sm -mt-4">{errors.confirmPassword.message}</p>}

          <select className="w-full h-[65px] rounded-xl bg-white/5 border border-white/20 px-14 text-white" {...register("gender")}>
            <option value="" className="text-black">Select Gender</option>
            <option value="male" className="text-black">Male</option>
            <option value="female" className="text-black">Female</option>
          </select>
          {errors.gender && <p className="text-red-400 text-sm -mt-4">{errors.gender.message}</p>}

          <button type="submit" disabled={isSubmitting} className="mt-4 w-full h-[70px] rounded-xl bg-gradient-to-r from-[#9587B3] to-[#5476D2] text-white text-xl font-semibold hover:opacity-90 transition">
            {isSubmitting ? "Loading..." : "Next"}
          </button>
        </form>
      </div>
    </section>
  );
}