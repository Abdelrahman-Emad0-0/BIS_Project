"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/notifications")
      .then((res) => { setNotifications(res.data.data || []); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.post("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {}
  };

  if (loading) return <div className="p-10 text-center text-[#602AEA] font-bold">Loading...</div>;

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 w-full max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-[#141033] mb-2">Notifications</h1>
        <p className="text-gray-500 text-sm">Stay updated with your learning activities.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-2">
            <h2 className="font-bold text-sm">All Notifications ({notifications.length})</h2>
            <button onClick={handleMarkAllAsRead} className="text-[#602AEA] text-xs font-bold hover:underline">
              Mark all as read
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No notifications yet.</p>
          ) : notifications.map((note) => (
            <div key={note.id} onClick={() => !note.is_read && handleMarkAsRead(note.id)}
              className={`flex gap-4 py-4 border-b border-gray-50 px-2 rounded-xl cursor-pointer transition ${!note.is_read ? "bg-purple-50/30" : ""}`}>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#602AEA] flex items-center justify-center shrink-0">
                <i className="fa-regular fa-bell"></i>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[#141033] text-sm truncate">{note.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{note.body}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] text-gray-400">{new Date(note.created_at).toLocaleDateString()}</span>
                {!note.is_read && <span className="w-2.5 h-2.5 rounded-full bg-[#602AEA]"></span>}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#141033] text-sm mb-5">Summary</h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-purple-50 text-[#602AEA] flex items-center justify-center text-2xl">
              <i className="fa-regular fa-bell"></i>
            </div>
            <div>
              <h4 className="text-xl font-bold text-[#141033]">{notifications.filter(n => !n.is_read).length}</h4>
              <p className="text-[11px] text-gray-500">Unread</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
