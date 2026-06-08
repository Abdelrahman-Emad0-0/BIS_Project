"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const LEVEL_ICONS: Record<string, string> = {
  Beginner: "🥉", Learner: "🥈", Advanced: "🥇", Expert: "💎",
};

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "from-orange-400 to-orange-600",
  Learner: "from-gray-400 to-gray-600",
  Advanced: "from-yellow-400 to-yellow-600",
  Expert: "from-purple-400 to-purple-700",
};

export default function RewardsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const fetchData = () => {
    api.get("/rewards")
      .then((res) => { setData(res.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleRedeem = async (code: string) => {
    setRedeeming(code);
    try {
      const res = await api.post("/rewards/redeem", { reward_code: code });
      alert(res.data.message || "Reward redeemed!");
      fetchData();
    } catch (err: any) {
      const errs = err.response?.data?.errors;
      const msg = errs?.reward_code?.[0] || err.response?.data?.message || "Failed to redeem";
      alert(msg);
    } finally { setRedeeming(null); }
  };

  if (loading) return <div className="p-20 text-center text-[#602AEA] font-bold">Loading Rewards...</div>;
  if (!data) return <div className="p-20 text-center text-gray-400">No rewards data available.</div>;

  const level = data.current_level || {};
  const levelName = level.name || "Beginner";
  const nextPts = data.next_reward?.points ?? 500;
  const progress = nextPts > 0 ? Math.min(100, Math.round((data.total_points / nextPts) * 100)) : 100;

  return (
    <div className="p-6 lg:p-8 w-full max-w-[1600px] mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-[#141033]">Rewards</h1>
        <p className="text-gray-500 text-sm">Learn, teach and engage to earn points and unlock amazing rewards.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* Points Hero */}
          <div className="bg-gradient-to-r from-[#1E174E] to-[#2B1D71] rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative z-10">
              <div>
                <p className="text-white/60 text-sm mb-1">Your Total Points</p>
                <h2 className="text-5xl font-bold">{data.total_points.toLocaleString()}</h2>
                <div className="mt-2 inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                  +{data.weekly_points} this week
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>Points to Next Reward ({data.next_reward?.title || levelName})</span>
                  <span>{data.total_points} / {nextPts}</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full">
                  <div className="h-2.5 bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-white/60">Keep going! You're almost there 🎯</p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${LEVEL_COLORS[levelName] || "from-gray-400 to-gray-600"} flex items-center justify-center text-3xl shadow-lg`}>
                  {LEVEL_ICONS[levelName] || "⭐"}
                </div>
                <p className="text-white font-bold">{levelName}</p>
              </div>
            </div>
          </div>

          {/* How You Earn */}
          <div>
            <h2 className="font-bold text-[#141033] text-lg mb-4">How You Earn Points</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(data.how_you_earn || []).map((item: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#602AEA] flex items-center justify-center shrink-0 text-lg">
                    {["📚","🔄","⭐","🎓","👥"][i] || "🎁"}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#141033]">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Rewards */}
          {data.student_rewards?.length > 0 && (
            <div>
              <h2 className="font-bold text-[#141033] text-lg mb-4">Rewards for Students</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.student_rewards.map((r: any) => {
                  const canRedeem = data.total_points >= r.points;
                  return (
                    <div key={r.code} className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col gap-3 ${canRedeem ? "border-[#602AEA]/30" : "border-gray-100"}`}>
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#602AEA] flex items-center justify-center text-xl">🎁</div>
                      <div>
                        <h4 className="font-bold text-sm text-[#141033]">{r.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs font-bold text-[#602AEA] bg-purple-50 px-2 py-1 rounded-lg">{r.points} pts</span>
                        <button onClick={() => handleRedeem(r.code)} disabled={!canRedeem || redeeming === r.code}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${canRedeem ? "bg-[#602AEA] text-white hover:bg-[#5022C0]" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                          {redeeming === r.code ? "..." : canRedeem ? "Redeem" : `Need ${r.points - data.total_points} more`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">

          {/* Current Level */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#141033] mb-4">Current Level</h3>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${LEVEL_COLORS[levelName] || "from-gray-400 to-gray-600"} flex items-center justify-center text-3xl mx-auto mb-3`}>
              {LEVEL_ICONS[levelName] || "⭐"}
            </div>
            <p className="text-center font-bold text-[#141033]">{levelName}</p>
            {data.next_reward && (
              <>
                <div className="w-full h-2 bg-gray-100 rounded-full mt-3">
                  <div className="h-2 bg-[#602AEA] rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-1">
                  {data.total_points} / {nextPts} pts — Keep going! You're almost Level {data.next_reward.title} 🎯
                </p>
              </>
            )}
          </div>

          {/* Recent Redemptions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#141033] mb-4">Recent Redemptions</h3>
            {data.redemptions?.length > 0 ? data.redemptions.map((r: any) => (
              <div key={r.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs">✓</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#141033] truncate">{r.title}</p>
                  <p className="text-[10px] text-gray-400">-{r.points} pts</p>
                </div>
              </div>
            )) : <p className="text-sm text-gray-400">No redemptions yet.</p>}
          </div>

          {/* Rewards System Overview */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#141033] mb-4">Rewards System Overview</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <p>• Points are updated in real time.</p>
              <p>• Rewards can be redeemed from your points balance.</p>
              <p>• Some rewards have limited availability and may change over time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
