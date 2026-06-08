"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const STARS = (n: number) => "★".repeat(Math.max(0, Math.min(5, n))) + "☆".repeat(Math.max(0, 5 - n));

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = () => {
    api.get("/reviews")
      .then(res => { const r = res.data.reviews||res.data||[]; setReviews(r); setFiltered(r); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    let f = reviews;
    if (ratingFilter !== "all") f = f.filter((r:any) => Math.round(r.rating) === Number(ratingFilter));
    if (search) f = f.filter((r:any) => r.user?.name?.toLowerCase().includes(search.toLowerCase()) || r.course?.title?.toLowerCase().includes(search.toLowerCase()) || r.comment?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(f);
  }, [search, ratingFilter, reviews]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this review?")) return;
    try { await api.delete(`/reviews/${id}`); load(); }
    catch(e:any) { alert(e.response?.data?.message||"Failed"); }
  };

  const avgRating = reviews.length ? (reviews.reduce((s:number,r:any)=>s+Number(r.rating),0)/reviews.length).toFixed(1) : "—";
  const positive  = reviews.filter(r=>r.rating>=4).length;
  const negative  = reviews.filter(r=>r.rating<=2).length;

  if (loading) return <div className="p-20 text-center text-[#602AEA] font-bold">Loading reviews...</div>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#1E1E4B]">Reviews</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total Reviews", value:reviews.length,  icon:"fa-star",        color:"bg-yellow-50 text-yellow-600" },
          { label:"Positive (4-5★)",value:positive,        icon:"fa-thumbs-up",   color:"bg-green-50 text-green-600" },
          { label:"Neutral (3★)",  value:reviews.filter(r=>Math.round(r.rating)===3).length, icon:"fa-minus", color:"bg-blue-50 text-blue-600" },
          { label:"Negative (1-2★)",value:negative,        icon:"fa-thumbs-down", color:"bg-red-50 text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div><p className="text-xs text-gray-500">{s.label}</p><h3 className="text-2xl font-bold text-[#1E1E4B] mt-0.5">{s.value}</h3></div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><i className={`fa-solid ${s.icon}`}></i></div>
          </div>
        ))}
      </div>

      {/* Avg Rating banner */}
      <div className="bg-gradient-to-r from-[#602AEA] to-[#7C3AED] rounded-2xl p-5 text-white flex items-center gap-6">
        <div>
          <p className="text-white/60 text-sm">Average Platform Rating</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-5xl font-bold">{avgRating}</span>
            <span className="text-yellow-300 text-2xl">★</span>
          </div>
        </div>
        <div className="flex-1 space-y-1">
          {[5,4,3,2,1].map(star => {
            const count = reviews.filter(r=>Math.round(r.rating)===star).length;
            const pct = reviews.length ? Math.round((count/reviews.length)*100) : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="text-white/60 w-3">{star}</span>
                <span className="text-yellow-300">★</span>
                <div className="flex-1 h-1.5 bg-white/20 rounded-full">
                  <div className="h-1.5 bg-yellow-300 rounded-full" style={{width:`${pct}%`}}></div>
                </div>
                <span className="text-white/60 w-6 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap gap-3 mb-5">
          <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#602AEA]">
            <option value="all">All Ratings</option>
            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
          </select>
          <div className="flex-1 min-w-[200px] flex items-center border border-gray-200 rounded-xl px-4 py-2 gap-2">
            <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search reviews..." className="flex-1 text-sm outline-none" />
          </div>
          <span className="text-xs text-gray-400 self-center">{filtered.length} reviews</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b border-gray-100">
                <th className="pb-3 text-left font-medium">Reviewer</th>
                <th className="pb-3 text-left font-medium">Course</th>
                <th className="pb-3 text-left font-medium">Rating</th>
                <th className="pb-3 text-left font-medium">Comment</th>
                <th className="pb-3 text-left font-medium">Date</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r:any) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#602AEA] text-white flex items-center justify-center font-bold text-[10px]">
                        {r.user?.name?.charAt(0)||"U"}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#1E1E4B]">{r.user?.name||"Unknown"}</p>
                        <p className="text-[9px] text-gray-400">{r.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-gray-500 max-w-[120px] truncate">{r.course?.title||"—"}</td>
                  <td className="py-3">
                    <span className="text-yellow-500 text-sm">{STARS(r.rating)}</span>
                  </td>
                  <td className="py-3 text-xs text-gray-600 max-w-[200px] truncate">{r.comment||"—"}</td>
                  <td className="py-3 text-gray-400 text-xs">
                    {r.created_at ? new Date(r.created_at).toLocaleDateString('en',{month:'short',day:'numeric'}) : '—'}
                  </td>
                  <td className="py-3 text-right">
                    <button onClick={() => handleDelete(r.id)}
                      className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 ml-auto">
                      <i className="fa-solid fa-trash text-xs"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan={6} className="py-10 text-center text-gray-400">No reviews found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
