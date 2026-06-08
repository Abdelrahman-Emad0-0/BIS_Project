"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherVerificationSchema, TeacherVerificationFormData } from "@/schema/registerTeacher3"; 
import { api } from "@/lib/api";

export default function VerificationPayoutPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TeacherVerificationFormData>({
    resolver: zodResolver(teacherVerificationSchema), 
  });

  const onSubmit = async (data: TeacherVerificationFormData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/register-teacher");
        return;
      }

      const formData = new FormData();

      // التأكد من وجود ملفات قبل إضافتها للـ FormData
      if (data.id_document?.[0]) formData.append("id_document", data.id_document[0]);
      if (data.certificates?.[0]) formData.append("certificates", data.certificates[0]);
      if (data.payment_method) formData.append("payment_method", data.payment_method);
      if (data.iban) formData.append("iban", data.iban);

      await api.post("/teacher/verification", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/terms-teach");
    } catch (error: any) {
      console.error("Verification Step error:", error.response?.data || error);
      alert("حدث خطأ أثناء التسجيل، يرجى التأكد من حجم ونوع الملفات.");
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-[#1A2E5A] overflow-hidden">
      <Link href="/register-teacher2" className="absolute top-6 left-6 text-white text-3xl z-50">
        <i className="fa-solid fa-chevron-left"></i>
      </Link>

      <h1 className="text-center pt-16 text-4xl font-bold text-white tracking-wide">Verification & Payout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-20 px-6 sm:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Upload Center */}
          <div>
            <h2 className="text-white text-3xl font-bold mb-6">Upload Center</h2>
            <label className="w-full min-h-[320px] rounded-2xl border-2 border-dashed border-[#667CAF] bg-[#1A2E5A] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#1B2445] transition">
              <i className="fa-solid fa-cloud-arrow-up text-7xl text-[#7A89D4] mb-8"></i>
              <h3 className="text-white text-2xl font-bold">Upload ID & Certificates</h3>
              <p className="text-white/60 mt-4 font-semibold">PNG, PDF, JPG (Max 10 MB)</p>
              <input type="file" {...register("id_document")} className="hidden" accept=".png,.jpg,.jpeg,.pdf" />
              <input type="file" {...register("certificates")} className="hidden" accept=".png,.jpg,.jpeg,.pdf" />
            </label>
            {errors.id_document && <p className="text-red-400 mt-2 font-semibold">{errors.id_document.message as string}</p>}
          </div>

          {/* Bank Details */}
          <div>
            <h2 className="text-white text-3xl font-bold mb-6">Bank Details</h2>
            <div className="w-full rounded-2xl border border-white/20 bg-[#1A2E5A] p-10">
              <div className="mb-8">
                <label className="block text-white text-lg font-semibold mb-3">Preferred Payment</label>
                <select {...register("payment_method")} className="w-full h-[55px] rounded-xl bg-[#1B2445] border border-white/10 px-5 text-white outline-none">
                  <option value="">Select Method</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                </select>
                {errors.payment_method && <p className="text-red-400 mt-2 text-sm">{errors.payment_method.message}</p>}
              </div>

              <div>
                <label className="block text-white text-lg font-semibold mb-3">Account Number / IBAN</label>
                <input type="text" {...register("iban")} className="w-full h-[55px] rounded-xl bg-[#1B2445] border border-white/10 px-5 text-white outline-none" />
                {errors.iban && <p className="text-red-400 mt-2 text-sm">{errors.iban.message}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-center pb-10">
          <button type="submit" disabled={isSubmitting} className="w-full max-w-6xl h-[80px] rounded-full bg-gradient-to-r from-[#CECBD0] to-[#7A89D4] text-white text-2xl font-bold shadow-lg hover:opacity-90 transition">
            {isSubmitting ? "Processing..." : "Finish & Create Teacher Account"}
          </button>
        </div>
      </form>
    </main>
  );
}