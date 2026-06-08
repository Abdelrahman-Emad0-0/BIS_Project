"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function CurriculumRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboardUser/create-course"); }, []);
  return <div className="p-20 text-center text-[#602AEA] font-bold">Redirecting...</div>;
}
