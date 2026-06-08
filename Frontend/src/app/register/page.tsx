"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchemaType } from "@/schema/registerSchema";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      const response = await api.post("/register", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.confirmPassword,
        gender: data.gender,
        date_of_birth: data.dateOfBirth, 
        learning_goal: data.learning_goal,
      });
console.log("response", response.data)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      router.push("/terms");
    } catch (error: any) {
      const errs = error.response?.data?.errors;
      const msg = errs
        ? Object.values(errs).flat().join("\n")
        : error.response?.data?.message || "Registration failed";
      alert(msg);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#F6E7F4] flex items-center justify-center relative">
      <Link href="/" className="absolute top-6 left-6 z-50 text-white text-2xl">
        <i className="fa-solid fa-chevron-left"></i>
      </Link>
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="relative hidden lg:block w-full h-full">
          <Image
            src="/images/44b7ed6765dae262da69851dd2358f3b72dd18cc.jpg"
            alt="Register background"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="flex items-center justify-center px-6 sm:px-10 py-16 bg-gradient-to-r from-[#8D6CD4] to-[#FAFAFA]">
          <div className="w-full max-w-xl">
            <h1 className="text-center text-2xl font-bold text-[#7A0B84]">Create Your Learning Account</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#7A0B84]">Full Name</label>
                <input type="text" className="w-full h-[50px] rounded-lg border px-4" {...register("name")} />
                <p className="text-red-500 text-sm">{errors.name?.message}</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#7A0B84]">Email Address</label>
                <input type="email" className="w-full h-[50px] rounded-lg border px-4" {...register("email")} />
                <p className="text-red-500 text-sm">{errors.email?.message}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-[#7A0B84]">Phone Number</label>
                <input type="text" className="w-full h-[50px] rounded-lg border px-4" {...register("phone")} />
                <p className="text-red-500 text-sm">{errors.phone?.message}</p>
              </div>

              {/* Date of Birth (تم إضافته) */}
              <div>
                <label className="block text-sm font-medium text-[#7A0B84]">Date of Birth</label>
                <input type="date" className="w-full h-[50px] rounded-lg border px-4" {...register("dateOfBirth")} />
                <p className="text-red-500 text-sm">{errors.dateOfBirth?.message}</p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#7A0B84]">Password</label>
                <input type="password" className="w-full h-[50px] rounded-lg border px-4" {...register("password")} />
                <p className="text-red-500 text-sm">{errors.password?.message}</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-[#7A0B84]">Confirm Password</label>
                <input type="password" className="w-full h-[50px] rounded-lg border px-4" {...register("confirmPassword")} />
                <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-[#7A0B84]">Gender</label>
                <select {...register("gender")} className="w-full h-[50px] rounded-lg border px-4">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <p className="text-red-500 text-sm">{errors.gender?.message}</p>
              </div>

              <button type="submit" className="w-full h-[55px] rounded-lg bg-[#8A008B] text-white font-semibold">
                Create account
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}