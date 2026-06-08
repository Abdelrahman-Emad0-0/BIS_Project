"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const STATUS_BADGE: Record<string, string> = {
  open:        "bg-red-50 text-red-600",
  in_progress: "bg-yellow-50 text-yellow-700",
  resolved:    "bg-green-50 text-green-600",
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = () => {
    api.get("/reports")
      .then(res => { const r = res.data.reports||res.data||[]; setReports(r); setFiltered(r); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    let f = reports;
    if (statusFilter !== "all") f = f.filter((r:any) => r.status === statusFilter);
    if (search) f = f.filter((r:any) => r.reason?.toLowerCase().includes(search.toLowerCase()) || r.user?.name?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(f);
  }, [search, statusFilter, reports]);

  const updateStatus = async (id: number, status: string) => {
    try { await api.put(`/reports/${id}`, { status }); load(); }
    catch(e:any) { alert(e.response?.data?.message||"Failed"); }
  };

  if (loading) return <div className="p-20 text-center text-[#602AEA] font-bold">Loading reports...</div>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#1E1E4B]">Reports</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total Reports",  value:reports.length,                                     icon:"fa-flag",         color:"bg-purple-50 text-purple-600" },
          { label:"Open",           value:reports.filter(r=>r.status==="open").length,         icon:"fa-circle-exclamation",color:"bg-red-50 text-red-600" },
          { label:"In Progress",    value:reports.filter(r=>r.status==="in_progress").length,  icon:"fa-spinner",      color:"bg-yellow-50 text-yellow-600" },
          { label:"Resolved",       value:reports.filter(r=>r.status==="resolved").length,     icon:"fa-check",        color:"bg-green-50 text-green-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div><p className="text-xs text-gray-500">{s.label}</p><h3 className="text-2xl font-bold text-[#1E1E4B] mt-0.5">{s.value}</h3></div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><i className={`fa-solid ${s.icon}`}></i></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap gap-3 mb-5">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#602AEA]">
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <div className="flex-1 min-w-[200px] flex items-center border border-gray-200 rounded-xl px-4 py-2 gap-2">
            <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search reports..." className="flex-1 text-sm outline-none" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <i className="fa-solid fa-flag text-gray-200 text-5xl mb-3"></i>
            <p className="text-gray-400">No reports found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((r:any) => (
              <div key={r.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50/50 transition">
                <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-flag text-sm"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-bold text-sm text-[#1E1E4B]">Report #{r.id}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[r.status||"open"]}`}>
                      {r.status||"open"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{r.reason||r.description||"No description"}</p>
                  <p className="text-[10px] text-gray-400">Reported by: {r.user?.name||"Unknown"}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {r.status !== "resolved" && (
                    <>
                      {r.status === "open" && (
                        <button onClick={() => updateStatus(r.id,"in_progress")}
                          className="text-xs bg-yellow-50 text-yellow-700 font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-100">
                          In Progress
                        </button>
                      )}
                      <button onClick={() => updateStatus(r.id,"resolved")}
                        className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1.5 rounded-lg hover:bg-green-100">
                        Resolve
                      </button>
                    </>
                  )}
                  {r.status === "resolved" && (
                    <button onClick={() => updateStatus(r.id,"open")}
                      className="text-xs bg-gray-50 text-gray-600 font-bold px-3 py-1.5 rounded-lg hover:bg-gray-100">
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
