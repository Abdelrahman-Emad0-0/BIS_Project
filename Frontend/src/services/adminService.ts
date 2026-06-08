import { api } from "@/lib/api";

export const getAllReports = async () => {
  const { data } = await api.get("/reports");
  return data.reports;
};

export const updateReportStatus = async (id: number, status: string) => {
  const { data } = await api.put(`/reports/${id}`, { status });
  return data.report;
};