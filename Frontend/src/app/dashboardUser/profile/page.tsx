"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "from-orange-400 to-orange-600",
  Learner: "from-gray-400 to-gray-600",
  Advanced: "from-yellow-400 to-yellow-600",
  Expert: "from-purple-400 to-purple-700",
};
const LEVEL_ICONS: Record<string, string> = {
  Beginner: "🥉", Learner: "🥈", Advanced: "🥇", Expert: "💎",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setProfile(JSON.parse(stored));
    } catch {}

    Promise.all([
      api.get("/profile"),
      api.get("/profile/stats"),
      api.get("/profile/achievements"),
      api.get("/profile/reviews"),
      api.get("/rewards"),
    ]).then(([pRes, sRes, aRes, rRes, rwRes]) => {
      const fresh = pRes.data.data;
      setProfile(fresh);
      if (fresh) localStorage.setItem("user", JSON.stringify(fresh));
      setStats(sRes.data.data);
      setAchievements(aRes.data.data || []);
      setReviews(rRes.data.data || []);
      setRewards(rwRes.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center text-[#602AEA] font-bold">Loading Profile...</div>;

  const initials = profile?.name
    ? profile.name.trim().split(/\s+/).map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : profile?.email?.charAt(0).toUpperCase() || "U";

  const levelName = rewards?.current_level?.name || "Beginner";
  const nextPts   = rewards?.next_reward?.points ?? 500;
  const totalPts  = rewards?.total_points ?? 0;
  const progress  = nextPts > 0 ? Math.min(100, Math.round((totalPts / nextPts) * 100)) : 100;

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 w-full max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#141033]">Profile</h1>
          <p className="text-gray-500 text-sm">Manage your profile, track your progress and showcase your journey.</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
          <i className="fa-solid fa-pen text-xs"></i> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* Main Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-2xl bg-[#602AEA] text-white flex items-center justify-center font-bold text-3xl shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-bold text-[#141033]">{profile?.name || "User"}</h2>
                  {profile?.role === "teacher" || profile?.role === "both" ? (
                    <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">✓ Verified</span>
                  ) : null}
                </div>
                <p className="text-gray-500 text-sm capitalize mt-0.5">{profile?.role || "Member"}</p>
                <p className="text-xs text-gray-400 mt-0.5">{profile?.email}</p>
                <p className="text-sm text-gray-500 mt-3">{profile?.bio || "No bio added yet. Tell the community about yourself!"}</p>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-3 shrink-0 flex-wrap">
                <div className="bg-gray-50 rounded-2xl p-4 text-center min-w-[80px]">
                  <p className="text-xl font-bold text-[#141033]">{stats?.courses_enrolled ?? 0}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Enrolled</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 text-center min-w-[80px]">
                  <p className="text-xl font-bold text-[#141033]">{stats?.courses_teaching ?? 0}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Teaching</p>
                </div>
              </div>
            </div>

            {/* Extended Stats Row */}
            <div className="mt-6 pt-6 border-t border-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Points", value: totalPts.toLocaleString(), icon: "fa-star", color: "text-yellow-500" },
                { label: "Sessions Done", value: stats?.sessions_completed ?? 0, icon: "fa-video", color: "text-blue-500" },
                { label: "Avg Rating", value: stats?.average_rating > 0 ? stats.average_rating : "—", icon: "fa-star-half-stroke", color: "text-orange-500" },
                { label: "Exchanges", value: stats?.exchanges_done ?? 0, icon: "fa-right-left", color: "text-purple-500" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center ${s.color}`}>
                    <i className={`fa-solid ${s.icon} text-sm`}></i>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#141033]">{s.value}</p>
                    <p className="text-[10px] text-gray-400">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex border-b border-gray-100 overflow-x-auto">
              {["about", "reviews", "activity"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-bold text-sm capitalize whitespace-nowrap transition border-b-2 ${activeTab === tab ? "text-[#602AEA] border-[#602AEA]" : "text-gray-400 border-transparent hover:text-[#602AEA]"}`}>
                  {tab === "reviews" ? `Reviews (${reviews.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "about" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-bold text-sm mb-2">About Me</h3>
                    <p className="text-sm text-gray-600">{profile?.bio || "No bio added yet."}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <i className="fa-solid fa-envelope text-[#602AEA] w-4"></i>
                      <span className="text-xs truncate">{profile?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <i className="fa-solid fa-phone text-[#602AEA] w-4"></i>
                      <span className="text-xs">{profile?.phone || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <i className="fa-solid fa-venus-mars text-[#602AEA] w-4"></i>
                      <span className="text-xs capitalize">{profile?.gender || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <i className="fa-solid fa-cake-candles text-[#602AEA] w-4"></i>
                      <span className="text-xs">{profile?.date_of_birth || "—"}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="flex flex-col gap-4">
                  {reviews.length > 0 ? reviews.map((r: any) => (
                    <div key={r.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
                        {r.user?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-sm">{r.user?.name || "Student"}</p>
                          <div className="text-yellow-400 text-xs">{"★".repeat(r.rating)}</div>
                        </div>
                        <p className="text-xs text-gray-600">{r.comment}</p>
                      </div>
                    </div>
                  )) : <p className="text-gray-400 text-sm">No reviews yet.</p>}
                </div>
              )}

              {activeTab === "activity" && (
                <p className="text-gray-400 text-sm">Activity feed coming soon.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">

          {/* Achievements */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#141033]">Achievements</h3>
              <span className="text-xs text-[#602AEA] font-bold">{achievements.length} earned</span>
            </div>
            {achievements.length > 0 ? achievements.map((a: any, i: number) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div className="w-9 h-9 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-trophy text-sm"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141033]">{a.title}</p>
                  <p className="text-[10px] text-gray-400">{a.description}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">🏆</div>
                <p className="text-sm text-gray-400">Complete courses and exchanges to earn achievements!</p>
              </div>
            )}
          </div>

          {/* Current Level */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#141033] mb-4">Current Level</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${LEVEL_COLORS[levelName] || "from-gray-400 to-gray-600"} flex items-center justify-center text-2xl`}>
                {LEVEL_ICONS[levelName] || "⭐"}
              </div>
              <div>
                <p className="font-bold text-[#141033]">{levelName}</p>
                <p className="text-xs text-gray-400">{totalPts.toLocaleString()} points</p>
              </div>
            </div>
            {rewards?.next_reward && (
              <>
                <div className="w-full h-2 bg-gray-100 rounded-full mb-1">
                  <div className="h-2 bg-[#602AEA] rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[10px] text-gray-400">{totalPts} / {nextPts} pts — Keep going! 🎯</p>
              </>
            )}
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#141033] mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "Edit Profile", icon: "fa-pen", href: "/dashboardUser/settings" },
                { label: "View Rewards", icon: "fa-gift", href: "/dashboardUser/rewards" },
                { label: "My Courses", icon: "fa-book-open", href: "/dashboardUser/my-courses" },
              ].map((a) => (
                <a key={a.label} href={a.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition text-sm font-medium text-gray-600">
                  <i className={`fa-solid ${a.icon} text-[#602AEA] w-4`}></i>
                  {a.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
