"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const STATUS_BADGE: Record<string, string> = {
  completed: "bg-green-50 text-green-600",
  pending:   "bg-yellow-50 text-yellow-600",
  failed:    "bg-red-50 text-red-600",
  refunded:  "bg-gray-50 text-gray-600",
};
const METHOD_ICON: Record<string, string> = {
  card: "fa-credit-card", cash: "fa-money-bill-wave",
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/payments")
      .then(res => { const p = res.data.payments||res.data||[]; setPayments(p); setFiltered(p); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let f = payments;
    if (statusFilter !== "all") f = f.filter((p:any) => p.status === statusFilter);
    if (search) f = f.filter((p:any) => p.id?.toString().includes(search) || p.user?.name?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(f);
  }, [search, statusFilter, payments]);

  const totalRevenue = payments.filter(p=>p.status==="completed").reduce((s:number,p:any)=>s+Number(p.amount),0);
  const pending = payments.filter(p=>p.status==="pending").length;
  const failed  = payments.filter(p=>p.status==="failed").length;

  if (loading) return <div className="p-20 text-center text-[#602AEA] font-bold">Loading payments...</div>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#1E1E4B]">Payments</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total Revenue", value:`EGP ${totalRevenue.toLocaleString()}`, icon:"fa-circle-dollar-to-slot", color:"bg-green-50 text-green-600" },
          { label:"Successful",    value:payments.filter(p=>p.status==="completed").length, icon:"fa-check-circle", color:"bg-blue-50 text-blue-600" },
          { label:"Pending",       value:pending, icon:"fa-clock", color:"bg-yellow-50 text-yellow-600" },
          { label:"Failed",        value:failed,  icon:"fa-xmark-circle", color:"bg-red-50 text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div><p className="text-xs text-gray-500">{s.label}</p><h3 className="text-xl font-bold text-[#1E1E4B] mt-0.5">{s.value}</h3></div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><i className={`fa-solid ${s.icon}`}></i></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap gap-3 mb-5">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#602AEA]">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <div className="flex-1 min-w-[200px] flex items-center border border-gray-200 rounded-xl px-4 py-2 gap-2">
            <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by transaction ID or user..." className="flex-1 text-sm outline-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b border-gray-100">
                <th className="pb-3 text-left font-medium">ID</th>
                <th className="pb-3 text-left font-medium">User</th>
                <th className="pb-3 text-left font-medium">Amount</th>
                <th className="pb-3 text-left font-medium">Method</th>
                <th className="pb-3 text-left font-medium">Status</th>
                <th className="pb-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p:any) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 text-gray-400 text-xs font-mono">TXN-{String(p.id).padStart(4,'0')}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#602AEA] text-white flex items-center justify-center font-bold text-[10px]">
                        {(p.user?.name||p.user_id||"U").toString().charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-[#1E1E4B]">{p.user?.name||`User #${p.user_id}`}</span>
                    </div>
                  </td>
                  <td className="py-3 font-bold text-[#1E1E4B]">EGP {Number(p.amount).toLocaleString()}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <i className={`fa-solid ${METHOD_ICON[p.payment_method]||"fa-wallet"} text-[#602AEA]`}></i>
                      <span className="capitalize">{p.payment_method}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[p.status]||"bg-gray-50 text-gray-500"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400 text-xs">
                    {p.date ? new Date(p.date).toLocaleDateString('en',{month:'short',day:'numeric',year:'numeric'}) : '—'}
                  </td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan={6} className="py-10 text-center text-gray-400">No payments found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
