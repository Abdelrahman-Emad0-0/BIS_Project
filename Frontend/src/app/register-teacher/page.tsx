"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchemaTeacher,
  RegisterSchemaTypeTeacher,
} from "@/schema/registerTeacher";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default function TeacherAccountInfoPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaTypeTeacher>({
    resolver: zodResolver(registerSchemaTeacher),
  });
  
  const router = useRouter();

  const onSubmit = async (data: RegisterSchemaTypeTeacher) => {
    console.log("SUBMIT WORKED");
    console.log(data);
    try {
      const response = await api.post("teacher/account-info", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.confirmPassword,
        gender: data.gender,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      router.push("/register-teacher2");
    } catch (error: any) {
      console.log(error.response?.data);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-[#1B243B] font-sans">
      
      {/* Left Panel: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-10 relative overflow-y-auto custom-scrollbar z-10">
        
        {/* Back Button */}
        <Link href="/" className="text-white hover:text-gray-300 transition w-fit mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Content Container */}
        <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full mx-auto py-8">
          
          <h1 className="text-[#F1F5F9] text-[22px] font-bold text-center mb-8 font-serif tracking-wide">
            Account Info
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="border border-[#2C3A5A] rounded-2xl p-6 md:p-8 flex flex-col gap-5 bg-transparent shadow-sm relative z-20">
            
            {/* Full Name */}
            <div>
              <label className="block text-[#E2E8F0] text-[13px] font-medium tracking-wide mb-1.5">
                Full Name
              </label>
              <input 
                type="text"
                className="w-full h-10 bg-[#243152] rounded-xl border border-[#3A4B75] px-4 text-white text-sm outline-none focus:border-[#5A73AA] focus:ring-1 focus:ring-[#5A73AA] transition" 
                {...register("name")}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[#E2E8F0] text-[13px] font-medium tracking-wide mb-1.5">
                Email Address
              </label>
              <input 
                type="email" 
                className="w-full h-10 bg-[#243152] rounded-xl border border-[#3A4B75] px-4 text-white text-sm outline-none focus:border-[#5A73AA] focus:ring-1 focus:ring-[#5A73AA] transition" 
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone number */}
            <div>
              <label className="block text-[#E2E8F0] text-[13px] font-medium tracking-wide mb-1.5">
                Phone number
              </label>
              <input 
                type="tel" 
                className="w-full h-10 bg-[#243152] rounded-xl border border-[#3A4B75] px-4 text-white text-sm outline-none focus:border-[#5A73AA] focus:ring-1 focus:ring-[#5A73AA] transition" 
                {...register("phone")}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#E2E8F0] text-[13px] font-medium tracking-wide mb-1.5">
                Password
              </label>
              <input 
                type="password" 
                className="w-full h-10 bg-[#243152] rounded-xl border border-[#3A4B75] px-4 text-white text-sm outline-none focus:border-[#5A73AA] focus:ring-1 focus:ring-[#5A73AA] transition" 
                {...register("password")}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[#E2E8F0] text-[13px] font-medium tracking-wide mb-1.5">
                Confirm Password
              </label>
              <input 
                type="password" 
                className="w-full h-10 bg-[#243152] rounded-xl border border-[#3A4B75] px-4 text-white text-sm outline-none focus:border-[#5A73AA] focus:ring-1 focus:ring-[#5A73AA] transition" 
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[#E2E8F0] text-[13px] font-medium tracking-wide mb-1.5">
                Gender
              </label>
              <div className="relative">
                <select 
                  className="w-full h-10 bg-[#243152] rounded-xl border border-[#3A4B75] px-4 text-white text-sm outline-none focus:border-[#5A73AA] focus:ring-1 focus:ring-[#5A73AA] transition appearance-none cursor-pointer"
                  {...register("gender")}
                >
                  <option value="" disabled selected>Select gender</option>
                  <option value="male" className="bg-[#1B243B]">Male</option>
                  <option value="female" className="bg-[#1B243B]">Female</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
            </div>

            {/* Next Button */}
            <div className="flex justify-end mt-4 relative z-20">
              <button 
                type="submit" 
                className="bg-[#2B3C62] hover:bg-[#3A4E7A] text-[#E2E8F0] border border-[#40568B] px-12 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md"
              >
                Next
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Right Panel: Image Section */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#0D1326] border-l border-[#2C3A5A]">
        <Image 
          src="/images/adcf2014e54baa1032381ad51bf489484911265a.jpg"
          alt="Futuristic AI Robot"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B243B] via-transparent to-transparent opacity-40 z-10 pointer-events-none"></div>
      </div>

    </div>
  );
}