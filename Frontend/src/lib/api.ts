import axios from "axios";

export const api = axios.create({
  // Vercel proxies /backend/* → https://learnxchange.ifree.page/api/* (no CORS)
  // Local dev: set NEXT_PUBLIC_API_URL=http://localhost:8000/api in .env.local
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://learnxchange-three.vercel.app/backend",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
