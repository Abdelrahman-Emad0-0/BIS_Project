"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const ROLE_BADGE: Record<string, string> = {
  learner: "bg-blue-50 text-blue-600",
  teacher: "bg-purple-50 text-purple-600",
  both:    "bg-green-50 text-green-600",
  admin:   "bg-red-50 text-red-600",
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editUser, setEditUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get("/users")
      .then(res => { const u = res.data.users||res.data||[]; setUsers(u); setFiltered(u); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    let f = users;
    if (roleFilter !== "all") f = f.filter((u:any) => u.role === roleFilter);
    if (search) f = f.filter((u:any) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(f);
  }, [search, roleFilter, users]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user permanently?")) return;
    try { await api.delete(`/users/${id}`); load(); } catch(e:any) { alert(e.response?.data?.message||"Failed"); }
  };

  const handleSave = async () => {
    if (!editUser) return;
    setSaving(true);
    try { await api.put(`/users/${editUser.id}`, { name:editUser.name, email:editUser.email, role:editUser.role }); setEditUser(null); load(); }
    catch(e:any) { alert(e.response?.data?.message||"Failed"); }
    finally { setSaving(false); }
  };

  const stats = [
    { label:"Total Users", value: users.length, icon:"fa-users", color:"bg-blue-50 text-blue-600" },
    { label:"Students", value: users.filter(u=>u.role==="learner"||u.role==="both").length, icon:"fa-user-graduate", color:"bg-green-50 text-green-600" },
    { label:"Teachers", value: users.filter(u=>u.role==="teacher"||u.role==="both").length, icon:"fa-chalkboard-user", color:"bg-purple-50 text-purple-600" },
    { label:"Admins", value: users.filter(u=>u.role==="admin").length, icon:"fa-shield-halved", color:"bg-orange-50 text-orange-600" },
  ];

  if (loading) return <div className="p-20 text-center text-[#602AEA] font-bold">Loading users...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E4B]">Users</h1>
          <p className="text-gray-500 text-sm">Manage all platform users.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <h3 className="text-2xl font-bold text-[#1E1E4B] mt-0.5">{s.value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <i className={`fa-solid ${s.icon}`}></i>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap gap-3 mb-5">
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#602AEA]">
            <option value="all">All Roles</option>
            <option value="learner">Students</option>
            <option value="teacher">Teachers</option>
            <option value="both">Exchange</option>
            <option value="admin">Admins</option>
          </select>
          <div className="flex-1 min-w-[200px] flex items-center border border-gray-200 rounded-xl px-4 py-2 gap-2">
            <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="flex-1 text-sm outline-none" />
          </div>
          <span className="text-xs text-gray-400 self-center">{filtered.length} users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b border-gray-100">
                <th className="pb-3 text-left font-medium">User</th>
                <th className="pb-3 text-left font-medium">Role</th>
                <th className="pb-3 text-left font-medium">Email</th>
                <th className="pb-3 text-left font-medium">Joined</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u:any) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#602AEA] text-white flex items-center justify-center font-bold text-xs">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-[#1E1E4B]">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${ROLE_BADGE[u.role]||"bg-gray-50 text-gray-500"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500 text-xs">{u.email}</td>
                  <td className="py-3 text-gray-400 text-xs">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('en',{month:'short',day:'numeric',year:'numeric'}) : '—'}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditUser({...u})}
                        className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100">
                        <i className="fa-solid fa-pen text-xs"></i>
                      </button>
                      <button onClick={() => handleDelete(u.id)}
                        className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100">
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Full Name</label>
                <input value={editUser.name} onChange={e => setEditUser((u:any)=>({...u,name:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Email</label>
                <input value={editUser.email} onChange={e => setEditUser((u:any)=>({...u,email:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Role</label>
                <select value={editUser.role} onChange={e => setEditUser((u:any)=>({...u,role:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]">
                  <option value="learner">Student (Learner)</option>
                  <option value="teacher">Teacher</option>
                  <option value="both">Exchange (Both)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditUser(null)} className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-[#602AEA] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
