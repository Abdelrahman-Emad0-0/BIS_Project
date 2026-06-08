"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const TYPE_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  session:  { bg: "bg-purple-100",  text: "text-purple-700",  dot: "bg-purple-500" },
  course:   { bg: "bg-green-100",   text: "text-green-700",   dot: "bg-green-500" },
  meeting:  { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500" },
  deadline: { bg: "bg-yellow-100",  text: "text-yellow-700",  dot: "bg-yellow-500" },
  reminder: { bg: "bg-pink-100",    text: "text-pink-700",    dot: "bg-pink-500" },
  event:    { bg: "bg-violet-100",  text: "text-violet-700",  dot: "bg-violet-500" },
};

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [view, setView]   = useState<"month"|"week"|"day">("month");
  const [data, setData]   = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title:"", subtitle:"", type:"event", starts_at:"", ends_at:"", color:"violet" });
  const [saving, setSaving] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string,boolean>>({
    session:true, course:true, meeting:true, deadline:true, reminder:true, event:true,
  });

  const dateStr = `${year}-${String(month+1).padStart(2,"0")}-01`;

  useEffect(() => {
    setLoading(true);
    api.get(`/calendar?view=${view}&date=${dateStr}`)
      .then((res) => { setData(res.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [year, month, view]);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); };
  const goToday   = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); };

  const allItems = [...(data?.events||[]), ...(data?.sessions||[])].filter(e => activeFilters[e.type]);

  const getItemsForDay = (day: number) =>
    allItems.filter(e => {
      const d = new Date(e.starts_at);
      return d.getDate()===day && d.getMonth()===month && d.getFullYear()===year;
    });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDay(year, month);
  const cells       = [...Array(firstDay).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)];

  const handleSaveEvent = async () => {
    if (!newEvent.title || !newEvent.starts_at) { alert("Title and start date are required"); return; }
    setSaving(true);
    try {
      await api.post("/calendar/events", newEvent);
      setShowAddModal(false);
      setNewEvent({ title:"", subtitle:"", type:"event", starts_at:"", ends_at:"", color:"violet" });
      // Reload
      const res = await api.get(`/calendar?view=${view}&date=${dateStr}`);
      setData(res.data.data);
    } catch { alert("Failed to save event"); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
      <div className="flex flex-col xl:flex-row gap-6">

        {/* ── Main Calendar ── */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold text-[#141033]">Calendar</h1>
              <p className="text-gray-500 text-sm">Manage your sessions, deadlines, and learning schedule.</p>
            </div>
            <button onClick={() => setShowAddModal(true)}
              className="bg-[#602AEA] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#5022C0] transition flex items-center gap-2">
              <i className="fa-solid fa-plus"></i> Add Event
            </button>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-wrap items-center gap-3 justify-between">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              {(["month","week","day"] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition ${view===v?"bg-white shadow text-[#141033]":"text-gray-500"}`}>
                  {v.charAt(0).toUpperCase()+v.slice(1)}
                </button>
              ))}
              <button onClick={goToday} className="px-4 py-1.5 rounded-lg text-sm font-bold text-gray-500 hover:text-[#141033]">Today</button>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                <i className="fa-solid fa-chevron-left text-sm"></i>
              </button>
              <h2 className="font-bold text-[#141033] text-base min-w-[140px] text-center">{MONTHS[month]} {year}</h2>
              <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                <i className="fa-solid fa-chevron-right text-sm"></i>
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {DAYS.map(d => (
                <div key={d} className="py-3 text-center text-xs font-bold text-gray-400">{d}</div>
              ))}
            </div>

            {loading ? (
              <div className="py-20 text-center text-[#602AEA] font-bold">Loading...</div>
            ) : (
              <div className="grid grid-cols-7">
                {cells.map((day, idx) => {
                  const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                  const items = day ? getItemsForDay(day) : [];
                  return (
                    <div key={idx} className={`min-h-[100px] p-2 border-b border-r border-gray-50 ${!day?"bg-gray-50/30":""}`}>
                      {day && (
                        <>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${isToday?"bg-[#602AEA] text-white":"text-gray-600"}`}>
                            {day}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            {items.slice(0,3).map((item: any, i: number) => {
                              const style = TYPE_STYLE[item.type] || TYPE_STYLE.event;
                              const time = new Date(item.starts_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
                              return (
                                <div key={i} className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${style.bg} ${style.text}`}>
                                  {time} {item.title}
                                </div>
                              );
                            })}
                            {items.length > 3 && (
                              <div className="text-[9px] text-gray-400 font-bold">+{items.length-3} more</div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex flex-wrap gap-4">
            {Object.entries(TYPE_STYLE).map(([type, style]) => (
              <div key={type} className="flex items-center gap-2 text-xs font-medium text-gray-600 capitalize">
                <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`}></div>
                {type}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="w-full xl:w-72 flex flex-col gap-4 shrink-0">

          {/* Mini Calendar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <i className="fa-solid fa-chevron-left text-[10px]"></i>
              </button>
              <span className="text-sm font-bold text-[#141033]">{MONTHS[month].slice(0,3)} {year}</span>
              <button onClick={nextMonth} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {DAYS.map(d => <div key={d} className="text-center text-[9px] font-bold text-gray-400">{d.charAt(0)}</div>)}
              {cells.map((day, idx) => {
                const isToday = day===today.getDate() && month===today.getMonth() && year===today.getFullYear();
                const hasEvent = day && getItemsForDay(day).length > 0;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    {day ? (
                      <button className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition ${isToday?"bg-[#602AEA] text-white":hasEvent?"bg-purple-100 text-purple-700":"text-gray-500 hover:bg-gray-100"}`}>
                        {day}
                      </button>
                    ) : <div className="w-6 h-6"/>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#141033] text-sm">Upcoming Sessions</h3>
              <span className="text-xs text-[#602AEA] font-bold cursor-pointer">View all</span>
            </div>
            <div className="flex flex-col gap-3">
              {(data?.upcoming_sessions||[]).slice(0,4).map((s: any) => {
                const dt = new Date(s.starts_at);
                const time = dt.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
                const isToday = dt.toDateString() === today.toDateString();
                const isTomorrow = dt.toDateString() === new Date(today.getTime()+86400000).toDateString();
                const label = isToday?"Today":isTomorrow?"Tomorrow":dt.toLocaleDateString([],{month:"short",day:"numeric"});
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 overflow-hidden flex items-center justify-center text-purple-600 font-bold text-xs shrink-0">
                      {s.partner_name?.charAt(0)||"S"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#141033] truncate">{s.title||"Session"}</p>
                      <p className="text-[10px] text-gray-400">with {s.partner_name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-bold text-[#602AEA]">{label}</p>
                      <p className="text-[10px] text-gray-400">{time}</p>
                    </div>
                  </div>
                );
              })}
              {!(data?.upcoming_sessions?.length) && <p className="text-xs text-gray-400">No upcoming sessions.</p>}
            </div>
          </div>

          {/* Calendar Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-[#141033] text-sm mb-4">Calendar Filters</h3>
            <div className="flex flex-col gap-3">
              {Object.entries(activeFilters).map(([type, active]) => {
                const style = TYPE_STYLE[type];
                const count = data?.filters?.[type+"s"] ?? data?.filters?.[type] ?? 0;
                return (
                  <button key={type} onClick={() => setActiveFilters(f => ({...f,[type]:!f[type]}))}
                    className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${active?`${style.dot} border-transparent`:"border-gray-300"}`}>
                        {active && <i className="fa-solid fa-check text-white text-[8px]"></i>}
                      </div>
                      <span className="text-xs font-medium capitalize text-gray-700">{type}s</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Add New Event</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Title *</label>
                <input value={newEvent.title} onChange={e => setNewEvent(n=>({...n,title:e.target.value}))}
                  placeholder="Event title" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Subtitle</label>
                <input value={newEvent.subtitle} onChange={e => setNewEvent(n=>({...n,subtitle:e.target.value}))}
                  placeholder="With someone / description" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Type</label>
                <select value={newEvent.type} onChange={e => setNewEvent(n=>({...n,type:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]">
                  {Object.keys(TYPE_STYLE).map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">Start *</label>
                  <input type="datetime-local" value={newEvent.starts_at} onChange={e => setNewEvent(n=>({...n,starts_at:e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#602AEA]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">End</label>
                  <input type="datetime-local" value={newEvent.ends_at} onChange={e => setNewEvent(n=>({...n,ends_at:e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#602AEA]" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-sm">Cancel</button>
              <button onClick={handleSaveEvent} disabled={saving}
                className="flex-1 bg-[#602AEA] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60">
                {saving ? "Saving..." : "Save Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
