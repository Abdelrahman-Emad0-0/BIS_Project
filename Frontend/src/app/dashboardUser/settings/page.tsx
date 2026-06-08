"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button onClick={onChange}
    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${checked ? "bg-[#602AEA]" : "bg-gray-200"}`}>
    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${checked ? "left-6" : "left-1"}`} />
  </button>
);

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const [account, setAccount] = useState({ name: "", email: "", phone: "" });
  const [passwords, setPasswords] = useState({ current_password: "", password: "", password_confirmation: "" });
  const [notifications, setNotifications] = useState({
    new_messages: true, exchange_requests: true, course_updates: true,
    session_reminders: true, rewards_points: true, marketing_emails: false,
  });

  useEffect(() => {
    api.get("/settings")
      .then((res) => {
        const d = res.data.data;
        setUser(d);
        setAccount({ name: d?.name || "", email: d?.email || "", phone: d?.phone || "" });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const saveAccount = async () => {
    setSaving(true);
    try {
      await api.put("/settings", account);
      // Update localStorage
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        localStorage.setItem("user", JSON.stringify({ ...u, ...account }));
      }
      alert("Account updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update");
    } finally { setSaving(false); }
  };

  const changePassword = async () => {
    if (!passwords.password || !passwords.password_confirmation) { alert("Fill all password fields"); return; }
    if (passwords.password !== passwords.password_confirmation) { alert("Passwords don't match"); return; }
    setChangingPw(true);
    try {
      await api.put("/settings", passwords);
      setPasswords({ current_password: "", password: "", password_confirmation: "" });
      alert("Password changed successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to change password");
    } finally { setChangingPw(false); }
  };

  if (loading) return <div className="p-20 text-center text-[#602AEA] font-bold">Loading settings...</div>;

  return (
    <div className="p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#141033]">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your account preferences and platform settings.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Column 1 */}
        <div className="flex flex-col gap-6">

          {/* Account Information */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <i className="fa-regular fa-user text-[#602AEA]"></i>
              <h2 className="font-bold text-[#141033]">Account Information</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Full Name</label>
                <input value={account.name} onChange={e => setAccount(a => ({ ...a, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#602AEA]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Email Address</label>
                <input value={account.email} onChange={e => setAccount(a => ({ ...a, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#602AEA]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Phone Number</label>
                <input value={account.phone} onChange={e => setAccount(a => ({ ...a, phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#602AEA]" />
              </div>
              <button onClick={saveAccount} disabled={saving}
                className="w-full bg-[#602AEA] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#5022C0] disabled:opacity-60 transition">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Language & Region */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <i className="fa-solid fa-globe text-[#602AEA]"></i>
              <h2 className="font-bold text-[#141033]">Language & Region</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Language</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#602AEA]">
                  <option>English</option>
                  <option>العربية</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Country</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#602AEA]">
                  <option>Egypt</option>
                  <option>Saudi Arabia</option>
                  <option>UAE</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <i className="fa-solid fa-shield-halved text-[#602AEA]"></i>
              <h2 className="font-bold text-[#141033]">Privacy</h2>
            </div>
            {[
              "Show my profile publicly",
              "Allow others to send me direct messages",
              "Show my reviews and ratings publicly",
              "Show my courses and sessions publicly",
            ].map((label) => (
              <label key={label} className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#602AEA]" />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-6">

          {/* Security */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <i className="fa-solid fa-lock text-[#602AEA]"></i>
              <h2 className="font-bold text-[#141033]">Security</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Current Password</label>
                <input type="password" value={passwords.current_password}
                  onChange={e => setPasswords(p => ({ ...p, current_password: e.target.value }))}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#602AEA]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">New Password</label>
                <input type="password" value={passwords.password}
                  onChange={e => setPasswords(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••" autoComplete="new-password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#602AEA]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Confirm New Password</label>
                <input type="password" value={passwords.password_confirmation}
                  onChange={e => setPasswords(p => ({ ...p, password_confirmation: e.target.value }))}
                  placeholder="••••••••" autoComplete="new-password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#602AEA]" />
              </div>
              <button onClick={changePassword} disabled={changingPw}
                className="w-full border-2 border-[#602AEA] text-[#602AEA] py-2.5 rounded-xl font-bold text-sm hover:bg-[#602AEA] hover:text-white disabled:opacity-60 transition">
                {changingPw ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <i className="fa-solid fa-palette text-[#602AEA]"></i>
              <h2 className="font-bold text-[#141033]">Appearance</h2>
            </div>
            <p className="text-xs font-bold text-gray-500 mb-3">Theme</p>
            {["Light Mode", "Dark Mode", "System Default"].map((t, i) => (
              <label key={t} className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="radio" name="theme" defaultChecked={i === 0} className="accent-[#602AEA]" />
                <span className="text-sm text-gray-700">{t}</span>
              </label>
            ))}
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
              <h2 className="font-bold text-red-600">Danger Zone</h2>
            </div>
            <p className="text-xs text-gray-500 mb-4">If you delete your account, there is no going back. This action cannot be undone.</p>
            <button className="w-full border-2 border-red-500 text-red-500 py-2.5 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-2">
              <i className="fa-solid fa-trash"></i> Delete Account
            </button>
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-6">

          {/* Notifications */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <i className="fa-regular fa-bell text-[#602AEA]"></i>
              <h2 className="font-bold text-[#141033]">Notifications</h2>
            </div>
            <div className="flex flex-col gap-4">
              {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, val]) => {
                const labels: Record<string, string> = {
                  new_messages: "New Messages", exchange_requests: "Exchange Requests",
                  course_updates: "Course Updates", session_reminders: "Session Reminders",
                  rewards_points: "Rewards & Points", marketing_emails: "Marketing Emails",
                };
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{labels[key]}</span>
                    <Toggle checked={val} onChange={() => setNotifications(n => ({ ...n, [key]: !n[key] }))} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exchange Preferences */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <i className="fa-solid fa-right-left text-[#602AEA]"></i>
              <h2 className="font-bold text-[#141033]">Exchange Preferences</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2">Preferred Learning</p>
                {["Languages", "Programming", "Graphic Design", "Marketing"].map(c => (
                  <label key={c} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="checkbox" defaultChecked={["Languages","Programming"].includes(c)} className="accent-[#602AEA]" />
                    <span className="text-xs text-gray-700">{c}</span>
                  </label>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2">Preferred Teaching</p>
                {["English", "Graphic Design", "Programming", "Marketing"].map(c => (
                  <label key={c} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="checkbox" defaultChecked={["English","Graphic Design"].includes(c)} className="accent-[#602AEA]" />
                    <span className="text-xs text-gray-700">{c}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
