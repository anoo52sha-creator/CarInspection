import { useState } from "react";
import { X, Send } from "lucide-react";

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 How can I help you with your car inspection today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

 const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = { role: "user", text: input };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setLoading(true);

  try {
    const res = await fetch("http://localhost:5001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg.text }),
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "bot", text: data.reply },
    ]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: "⚠️ Server not responding. Please try again." },
    ]);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-xl z-50">
          <div className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-xl">
            <span>AutoVera Assistant 🤖</span>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="p-3 h-64 overflow-y-auto text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                {/* <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-600 text-Black"
                      : "bg-black-100"
                  }`}
                >
                  {msg.text}
                </span> */}
                <span
                  className={`inline-block px-3 py-2 rounded-lg text-black ${
                    msg.role === "user"
                      ? "bg-gray-300"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && <p className="text-gray-500">Typing...</p>}
          </div>

          <div className="flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              // className="flex-1 px-3 py-2 text-sm outline-none"
               className="flex-1 px-3 py-2 text-sm outline-none bg-gray-200 text-black placeholder-gray-500"
            />
            <button
              onClick={sendMessage}
              // className="bg-blue-600 text-gray px-4"
              className="bg-blue-600 text-black px-4 flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
