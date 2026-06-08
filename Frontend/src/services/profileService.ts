import { api } from "@/lib/api";


export const getProfileStats = async () => {
  const { data } = await api.get("/profile/stats");
  return data.data;
};


export const getAchievements = async () => {
  const { data } = await api.get("/profile/achievements");
  return data.data;
};