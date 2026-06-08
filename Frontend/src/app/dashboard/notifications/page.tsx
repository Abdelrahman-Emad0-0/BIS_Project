"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminNotificationsPage() {
  const [data, setData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all"|"unread"|"sent">("all");
  const [showSend, setShowSend] = useState(false);
  const [form, setForm] = useState({ title:"", body:"", user_id:"" });
  const [sending, setSending] = useState(false);

  const load = async () => {
    try {
      const [nRes, uRes] = await Promise.all([
        api.get("/admin/notifications"),
        api.get("/users"),
      ]);
      setData(nRes.data);
      setUsers(uRes.data.users || uRes.data || []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleSend = async () => {
    if (!form.title) { alert("Title is required"); return; }
    setSending(true);
    try {
      const res = await api.post("/admin/notifications/send", {
        title: form.title,
        body:  form.body || null,
        user_id: form.user_id || null,
      });
      alert(res.data.message);
      setShowSend(false);
      setForm({ title:"", body:"", user_id:"" });
      load();
    } catch(e:any) { alert(e.response?.data?.message||"Failed to send"); }
    finally { setSending(false); }
  };

  const notifications = data?.data?.data || [];
  const stats = data?.stats || {};

  const filtered = filter === "unread"
    ? notifications.filter((n:any) => !n.is_read)
    : notifications;

  if (loading) return <div className="p-20 text-center text-[#602AEA] font-bold">Loading notifications...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E4B]">Notifications</h1>
          <p className="text-gray-500 text-sm">Manage and send notifications to users.</p>
        </div>
        <button onClick={() => setShowSend(true)}
          className="bg-[#602AEA] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#5022C0] transition flex items-center gap-2">
          <i className="fa-solid fa-paper-plane"></i> Send Notification
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total Sent",  value:stats.total||0,  icon:"fa-bell",     color:"bg-purple-50 text-purple-600" },
          { label:"Unread",      value:stats.unread||0, icon:"fa-envelope", color:"bg-red-50 text-red-600" },
          { label:"Users",       value:users.length,    icon:"fa-users",    color:"bg-blue-50 text-blue-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div><p className="text-xs text-gray-500">{s.label}</p><h3 className="text-2xl font-bold text-[#1E1E4B] mt-0.5">{s.value}</h3></div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><i className={`fa-solid ${s.icon}`}></i></div>
          </div>
        ))}
      </div>

      {/* Tabs + List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-5">
          {(["all","unread"] as const).map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition ${filter===t?"bg-white shadow text-[#1E1E4B]":"text-gray-500"}`}>
              {t} {t==="unread" && stats.unread > 0 && <span className="ml-1 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{stats.unread}</span>}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <i className="fa-solid fa-bell text-gray-200 text-5xl mb-3"></i>
              <p className="text-gray-400">No notifications.</p>
            </div>
          ) : filtered.map((n:any) => (
            <div key={n.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition ${!n.is_read ? "border-[#602AEA]/20 bg-purple-50/30" : "border-gray-100 bg-gray-50/30"}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${!n.is_read ? "bg-[#602AEA] text-white" : "bg-gray-200 text-gray-500"}`}>
                <i className="fa-solid fa-bell text-sm"></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="font-bold text-sm text-[#1E1E4B]">{n.title}</p>
                  {!n.is_read && <span className="w-2 h-2 rounded-full bg-[#602AEA]"></span>}
                </div>
                {n.body && <p className="text-xs text-gray-600 mb-1">{n.body}</p>}
                <p className="text-[10px] text-gray-400">
                  To: {n.user?.name||"Unknown"} • {n.created_at ? new Date(n.created_at).toLocaleString('en',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '—'}
                </p>
              </div>
              {!n.is_read && (
                <span className="text-[9px] font-bold bg-[#602AEA] text-white px-2 py-0.5 rounded-full shrink-0">New</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Send Modal */}
      {showSend && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Send Notification</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Send To</label>
                <select value={form.user_id} onChange={e => setForm(f=>({...f,user_id:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]">
                  <option value="">📢 All Users (Broadcast)</option>
                  {users.filter((u:any)=>u.role!=="admin").map((u:any) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Title *</label>
                <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))}
                  placeholder="Notification title"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Message (optional)</label>
                <textarea value={form.body} onChange={e => setForm(f=>({...f,body:e.target.value}))}
                  placeholder="Additional details..."
                  rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA] resize-none" />
              </div>
              {!form.user_id && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
                  ⚠️ This will send to ALL non-admin users ({users.filter((u:any)=>u.role!=="admin").length} users).
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowSend(false)} className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-sm">Cancel</button>
              <button onClick={handleSend} disabled={sending}
                className="flex-1 bg-[#602AEA] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60">
                {sending ? "Sending..." : "Send Notification"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
