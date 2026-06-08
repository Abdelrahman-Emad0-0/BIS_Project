"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function MessagesPage() {
  const [inbox, setInbox] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/messages/inbox")
      .then((res) => { setInbox(res.data.data || []); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  const handleSendMessage = async () => {
    if (!activeChat || !newMessage.trim()) return;
    try {
      await api.post("/messages", { receiver_id: activeChat.sender?.id, content: newMessage });
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (loading) return <div className="p-10 text-center text-[#602AEA] font-bold">Loading Messages...</div>;

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-4 w-full max-w-[1600px] mx-auto h-[calc(100vh-90px)]">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold text-[#141033] mb-1">Messages</h1>
        <p className="text-gray-500 text-sm">Connect and communicate with your learning community.</p>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row gap-6 min-h-0 mt-2">
        {/* Inbox List */}
        <div className="w-full xl:w-[340px] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
            {inbox.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">No messages yet.</p>
            ) : inbox.map((msg) => (
              <div key={msg.id} onClick={() => setActiveChat(msg)}
                className={`flex gap-3 p-3 rounded-xl cursor-pointer ${activeChat?.id === msg.id ? "bg-[#F8F5FF]" : "hover:bg-gray-50"}`}>
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {msg.sender?.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate">{msg.sender?.name || "Unknown"}</h4>
                  <p className="text-xs text-gray-500 truncate">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-w-0 overflow-hidden">
          {activeChat ? (
            <>
              <div className="p-4 border-b font-bold text-sm">{activeChat.sender?.name}</div>
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                <div className="bg-gray-50 border p-3 rounded-lg text-xs self-start max-w-xs">{activeChat.content}</div>
              </div>
              <div className="p-4 border-t flex gap-3">
                <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 h-[45px] rounded-full bg-gray-50 border px-5 outline-none text-sm"
                  placeholder="Type a message..." />
                <button onClick={handleSendMessage}
                  className="w-[45px] h-[45px] rounded-full bg-[#602AEA] text-white flex items-center justify-center">
                  <i className="fa-regular fa-paper-plane"></i>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">Select a chat to start</div>
          )}
        </div>
      </div>
    </div>
  );
}
