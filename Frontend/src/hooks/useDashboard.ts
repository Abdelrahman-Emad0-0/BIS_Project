import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { DashboardData } from "@/types/dashboard";

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get<DashboardData>("/dashboard");
        setData(response.data);
      } catch (err: any) {
        console.error("Error fetching dashboard:", err);
        setError("faild to load dashboard data. please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};