"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchemaType } from "@/schema/loginSchema";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const response = await api.post("/login", {
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const role = response.data.user?.role;

      if (role === "admin") {
        router.push("/dashboard");
      } else {
        // teacher, learner, both — all go to user dashboard
        router.push("/dashboardUser");
      }
    } catch (error: any) {
      console.error("Login Error:", error.response?.data || error.message);
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        <div className="flex flex-col gap-14 text-center lg:text-left">
          <p className="text-[#3C1B70] font-semibold text-sm">Learn X Change</p>
          <h1 className="text-2xl font-bold text-black leading-tight">
            Welcome Back to <br />
            <span className="text-[#3C1B70] text-5xl sm:text-6xl font-extrabold">Learn X Change</span>
          </h1>
          <p className="text-gray-700 text-lg max-w-md mx-auto lg:mx-0">
            Learn, Teach and grow your skills <br /> with people around the world
          </p>
          <div className="w-full flex justify-center lg:justify-start">
            <img src="/images/5596276e6604fb1226bb924f7193e9d5a79a9afc.png" alt="illustration" className="w-[320px] sm:w-[420px] lg:w-[500px]" />
          </div>
          <div className="w-full max-w-[650px] bg-[#A993E8] rounded-[28px] p-6">
            <div className="bg-white rounded-[22px] px-6 py-10 shadow-md">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                {[["fa-user-group","Connect"],["fa-book-open","Learn"],["fa-graduation-cap","Teach"],["fa-trophy","Earn points"]].map(([icon, label]) => (
                  <div key={label} className="flex flex-col items-center">
                    <i className={`fa-solid ${icon} text-[#5C2D91] text-2xl`}></i>
                    <p className="text-xs font-semibold text-[#5C2D91]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-md bg-white rounded-[22px] shadow-xl border border-gray-200 px-7 py-10">
            <h2 className="text-3xl font-extrabold text-[#3C1B70] text-center">Login to your Account</h2>
            <p className="text-gray-500 text-center mt-2">Continue your learning journey</p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input type="email" placeholder="Enter Your Email"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    {...register("email")} />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input type="password" placeholder="Enter Your Password"
                    className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    {...register("password")} />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>
              </div>

              <button type="submit" className="w-full mt-6 bg-[#3C1B70] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#2d1455] transition">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
