"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const INITIALS = (name: string) => name?.trim().split(/\s+/).map(n => n[0]).join("").toUpperCase().slice(0,2) || "?";
const COLORS = ["bg-purple-500","bg-blue-500","bg-green-500","bg-orange-500","bg-pink-500","bg-indigo-500"];
const COLOR = (id: number) => COLORS[id % COLORS.length];

export default function ExchangePage() {
  const [tab, setTab] = useState<"matches"|"requests"|"my-matches">("matches");
  const [matches, setMatches] = useState<any[]>([]);
  const [incoming, setIncoming] = useState<any[]>([]);
  const [outgoing, setOutgoing] = useState<any[]>([]);
  const [myMatches, setMyMatches] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [popularSkills, setPopularSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mySkills, setMySkills] = useState<any[]>([]);
  const [allSkills, setAllSkills] = useState<any[]>([]);
  const [showRequestModal, setShowRequestModal] = useState<any>(null);
  const [reqForm, setReqForm] = useState({ requester_skill_id:"", partner_skill_id:"", message:"" });
  const [sending, setSending] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState<"teach"|"learn"|null>(null);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [savingSkills, setSavingSkills] = useState(false);

  const load = async () => {
    try {
      const [mRes, eRes, ovRes, psRes, msRes, skRes] = await Promise.all([
        api.get("/exchange/matches"),
        api.get("/exchange"),
        api.get("/exchange/overview"),
        api.get("/exchange/popular-skills"),
        api.get("/my-skills"),
        api.get("/skills"),
      ]);
      setMatches(mRes.data.data || []);
      setIncoming(eRes.data.incoming || []);
      setOutgoing(eRes.data.outgoing || []);
      setMyMatches(eRes.data.matched || []);
      setOverview(ovRes.data.data || null);
      setPopularSkills(psRes.data.data || []);
      setMySkills(msRes.data.data || []);
      setAllSkills(skRes.data.data || []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id: number, status: string) => {
    try {
      await api.put(`/exchange/${id}/status`, { status });
      load();
    } catch(e: any) { alert(e.response?.data?.message || "Failed"); }
  };

  const openSkillModal = (type: "teach"|"learn") => {
    const existing = mySkills.filter((s:any) => s.type === type).map((s:any) => s.skill_id || s.id);
    setSelectedSkillIds(existing);
    setShowSkillModal(type);
  };

  const saveSkills = async () => {
    if (!showSkillModal) return;
    setSavingSkills(true);
    try {
      await api.post("/my-skills", { skill_ids: selectedSkillIds, type: showSkillModal });
      setShowSkillModal(null);
      load();
    } catch(e:any) { alert(e.response?.data?.message || "Failed to save skills"); }
    finally { setSavingSkills(false); }
  };

  const sendRequest = async () => {
    if (!reqForm.requester_skill_id || !reqForm.partner_skill_id) {
      alert("Select both skills"); return;
    }
    setSending(true);
    try {
      await api.post("/exchange", {
        partner_id: showRequestModal.user.id,
        requester_skill_id: Number(reqForm.requester_skill_id),
        partner_skill_id: Number(reqForm.partner_skill_id),
        message: reqForm.message,
      });
      alert("Exchange request sent!");
      setShowRequestModal(null);
      setReqForm({ requester_skill_id:"", partner_skill_id:"", message:"" });
      load();
    } catch(e: any) { alert(e.response?.data?.message || "Failed to send request"); }
    finally { setSending(false); }
  };

  if (loading) return <div className="p-20 text-center text-[#602AEA] font-bold">Loading Exchange...</div>;

  const myTeachSkills = mySkills.filter((s:any) => s.type === "teach");

  return (
    <div className="p-6 lg:p-8 w-full max-w-[1600px] mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-[#141033]">Exchange</h1>
        <p className="text-gray-500 text-sm">Connect, teach, learn, and grow together.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            {[
              { key:"matches", icon:"fa-users", label:"Suggested Matches" },
              { key:"requests", icon:"fa-paper-plane", label:`My Requests ${incoming.length ? `(${incoming.length})` : ""}` },
              { key:"my-matches", icon:"fa-handshake", label:"My Matches" },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${tab===t.key?"bg-white shadow text-[#141033]":"text-gray-500 hover:text-[#141033]"}`}>
                <i className={`fa-solid ${t.icon}`}></i>{t.label}
              </button>
            ))}
          </div>

          {/* Suggested Matches */}
          {tab === "matches" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-[#141033] text-base">Top Matches for You</h2>
                <span className="text-xs text-[#602AEA] font-bold">{matches.length} matches found</span>
              </div>

              {matches.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 border text-center">
                  <div className="text-5xl mb-3">🔍</div>
                  <h3 className="font-bold text-lg text-[#141033] mb-2">No matches yet</h3>
                  <p className="text-gray-500 text-sm">Add your skills (what you teach & want to learn) to find matches.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matches.map((m: any, i: number) => (
                    <div key={m.user.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-11 h-11 rounded-full ${COLOR(m.user.id)} text-white flex items-center justify-center font-bold`}>
                          {INITIALS(m.user.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-[#141033]">{m.user.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{m.user.role}</p>
                        </div>
                        <div className="bg-purple-50 text-[#602AEA] text-[10px] font-bold px-2 py-1 rounded-full">
                          {m.score * 20}% match
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mb-4 text-xs">
                        {m.they_teach?.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 shrink-0">Can teach:</span>
                            <div className="flex flex-wrap gap-1">
                              {m.they_teach.map((s:any) => (
                                <span key={s.id} className="bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded">{s.name}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {m.they_learn?.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 shrink-0">Wants to learn:</span>
                            <div className="flex flex-wrap gap-1">
                              {m.they_learn.map((s:any) => (
                                <span key={s.id} className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">{s.name}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <button onClick={() => { setShowRequestModal(m); setReqForm({ requester_skill_id:"", partner_skill_id:"", message:"" }); }}
                        className="w-full bg-[#602AEA] text-white py-2 rounded-xl font-bold text-sm hover:bg-[#5022C0] transition">
                        Request Exchange
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Popular Skills */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold text-[#141033] text-base">Popular Skills in Exchange</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSkills.map((s:any) => (
                    <span key={s.id} className="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full hover:border-[#602AEA] hover:text-[#602AEA] cursor-pointer transition">
                      {s.name} <span className="text-gray-400 font-normal">({s.total})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Requests Tab */}
          {tab === "requests" && (
            <div className="flex flex-col gap-6">
              {/* Incoming */}
              <div>
                <h2 className="font-bold text-[#141033] mb-3">Incoming Requests</h2>
                {incoming.length === 0 ? (
                  <div className="bg-white rounded-2xl p-6 border text-center text-gray-400 text-sm">No incoming requests.</div>
                ) : incoming.map((ex:any) => (
                  <div key={ex.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-3 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${COLOR(ex.requester?.id||0)} text-white flex items-center justify-center font-bold shrink-0`}>
                      {INITIALS(ex.requester?.name||"?")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#141033]">
                        <span className="text-[#602AEA]">{ex.requester?.name}</span> wants to learn <strong>{ex.partner_skill?.name}</strong> from you
                      </p>
                      <p className="text-xs text-gray-500">They offer: <strong>{ex.requester_skill?.name}</strong></p>
                      {ex.message && <p className="text-xs text-gray-400 mt-1 italic">"{ex.message}"</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleStatus(ex.id, "accepted")}
                        className="bg-[#602AEA] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#5022C0]">Accept</button>
                      <button onClick={() => handleStatus(ex.id, "rejected")}
                        className="border border-red-300 text-red-500 text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-50">Decline</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Outgoing */}
              <div>
                <h2 className="font-bold text-[#141033] mb-3">Sent Requests</h2>
                {outgoing.length === 0 ? (
                  <div className="bg-white rounded-2xl p-6 border text-center text-gray-400 text-sm">No sent requests.</div>
                ) : outgoing.map((ex:any) => (
                  <div key={ex.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-3 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${COLOR(ex.partner?.id||0)} text-white flex items-center justify-center font-bold shrink-0`}>
                      {INITIALS(ex.partner?.name||"?")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#141033]">
                        You requested <strong>{ex.partner_skill?.name}</strong> from <span className="text-[#602AEA]">{ex.partner?.name}</span>
                      </p>
                      <p className="text-xs text-gray-500">You offered: <strong>{ex.requester_skill?.name}</strong></p>
                    </div>
                    <span className="text-[10px] font-bold bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">Pending</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Matches Tab */}
          {tab === "my-matches" && (
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-[#141033]">Your Matches</h2>
              {myMatches.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 border text-center">
                  <div className="text-5xl mb-3">🤝</div>
                  <p className="text-gray-400 text-sm">No accepted matches yet. Accept incoming requests to start!</p>
                </div>
              ) : myMatches.map((ex:any) => {
                const stored = localStorage.getItem("user");
                const me = stored ? JSON.parse(stored) : null;
                const isRequester = ex.requester_id === me?.id;
                const partner = isRequester ? ex.partner : ex.requester;
                const theyTeach = isRequester ? ex.partner_skill : ex.requester_skill;
                const iTeach = isRequester ? ex.requester_skill : ex.partner_skill;
                return (
                  <div key={ex.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${COLOR(partner?.id||0)} text-white flex items-center justify-center font-bold text-lg shrink-0`}>
                      {INITIALS(partner?.name||"?")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm text-[#141033]">{partner?.name}</p>
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      </div>
                      <p className="text-xs text-gray-500">Teaching: <strong>{theyTeach?.name}</strong></p>
                      <p className="text-xs text-gray-500">Learning: <strong>{iTeach?.name}</strong></p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="border border-gray-200 text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-50">Message</button>
                      <button onClick={() => handleStatus(ex.id, "completed")}
                        className="bg-green-50 text-green-700 text-xs font-bold px-3 py-2 rounded-lg hover:bg-green-100">
                        Mark Complete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-72 flex flex-col gap-4 shrink-0">
          {/* Exchange Overview */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#141033] mb-4">Exchange Overview</h3>
            {[
              { label:"Total Matches",      value: overview?.total_matches ?? 0,       icon:"fa-handshake",    color:"text-purple-600 bg-purple-50" },
              { label:"Pending Requests",   value: overview?.pending_requests ?? 0,    icon:"fa-clock",        color:"text-yellow-600 bg-yellow-50" },
              { label:"Skills You Can Teach", value: overview?.skills_can_teach ?? 0,  icon:"fa-chalkboard",   color:"text-blue-600 bg-blue-50" },
              { label:"Skills to Learn",    value: overview?.skills_want_to_learn ?? 0,icon:"fa-graduation-cap",color:"text-green-600 bg-green-50" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                  <i className={`fa-solid ${s.icon} text-sm`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
                <span className="font-bold text-[#141033]">{s.value}</span>
              </div>
            ))}
          </div>

          {/* My Skills */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#141033] mb-3">My Skills</h3>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-gray-500">I Can Teach</p>
                <button onClick={() => openSkillModal("teach")}
                  className="text-[10px] text-[#602AEA] font-bold flex items-center gap-1 hover:underline">
                  <i className="fa-solid fa-plus text-[8px]"></i> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {mySkills.filter((s:any)=>s.type==="teach").map((s:any) => (
                  <span key={s.id} className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded">{s.skill?.name||s.name}</span>
                ))}
                {mySkills.filter((s:any)=>s.type==="teach").length===0 && (
                  <button onClick={() => openSkillModal("teach")} className="text-xs text-gray-400 hover:text-[#602AEA] transition">+ Add skills you can teach</button>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-gray-500">I Want to Learn</p>
                <button onClick={() => openSkillModal("learn")}
                  className="text-[10px] text-[#602AEA] font-bold flex items-center gap-1 hover:underline">
                  <i className="fa-solid fa-plus text-[8px]"></i> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {mySkills.filter((s:any)=>s.type==="learn").map((s:any) => (
                  <span key={s.id} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">{s.skill?.name||s.name}</span>
                ))}
                {mySkills.filter((s:any)=>s.type==="learn").length===0 && (
                  <button onClick={() => openSkillModal("learn")} className="text-xs text-gray-400 hover:text-[#602AEA] transition">+ Add skills you want to learn</button>
                )}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#141033] mb-3">Tips for Better Matches</h3>
            {[
              { icon:"fa-user", tip:"Complete your profile" },
              { icon:"fa-bolt", tip:"Be active — respond to requests fast" },
              { icon:"fa-bullseye", tip:"Be clear about what you want to teach/learn" },
            ].map((t,i) => (
              <div key={i} className="flex items-start gap-2 py-2 text-xs text-gray-600">
                <div className="w-6 h-6 rounded-full bg-purple-50 text-[#602AEA] flex items-center justify-center shrink-0 mt-0.5">
                  <i className={`fa-solid ${t.icon} text-[9px]`}></i>
                </div>
                {t.tip}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Request Exchange Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-1">Request Exchange</h2>
            <p className="text-gray-500 text-sm mb-6">with <strong>{showRequestModal.user.name}</strong></p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">I will teach (my skill)</label>
                <select value={reqForm.requester_skill_id} onChange={e => setReqForm(f=>({...f,requester_skill_id:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]">
                  <option value="">Select skill you'll teach</option>
                  {myTeachSkills.map((s:any) => (
                    <option key={s.skill_id||s.id} value={s.skill_id||s.id}>{s.skill?.name||s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">I want to learn from them</label>
                <select value={reqForm.partner_skill_id} onChange={e => setReqForm(f=>({...f,partner_skill_id:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]">
                  <option value="">Select skill you want</option>
                  {showRequestModal.they_teach?.map((s:any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Message (optional)</label>
                <textarea value={reqForm.message} onChange={e => setReqForm(f=>({...f,message:e.target.value}))}
                  placeholder="Hi! I'd love to exchange skills with you..."
                  rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA] resize-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowRequestModal(null)} className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-sm">Cancel</button>
              <button onClick={sendRequest} disabled={sending}
                className="flex-1 bg-[#602AEA] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60">
                {sending ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Picker Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-1">
              {showSkillModal === "teach" ? "Skills I Can Teach" : "Skills I Want to Learn"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">Select all that apply — this helps us find your best matches.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto mb-6">
              {allSkills.map((s:any) => {
                const selected = selectedSkillIds.includes(s.id);
                return (
                  <button key={s.id}
                    onClick={() => setSelectedSkillIds(ids => selected ? ids.filter(id=>id!==s.id) : [...ids,s.id])}
                    className={`px-3 py-2.5 rounded-xl text-sm font-bold border-2 transition text-left ${selected ? "border-[#602AEA] bg-purple-50 text-[#602AEA]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    {selected && <i className="fa-solid fa-check mr-1.5 text-xs"></i>}
                    {s.name}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-gray-400 mb-4">{selectedSkillIds.length} skill{selectedSkillIds.length !== 1 ? "s" : ""} selected</div>

            <div className="flex gap-3">
              <button onClick={() => setShowSkillModal(null)} className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-sm">Cancel</button>
              <button onClick={saveSkills} disabled={savingSkills}
                className="flex-1 bg-[#602AEA] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60">
                {savingSkills ? "Saving..." : "Save Skills"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
