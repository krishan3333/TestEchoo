"use client";

import React, { useEffect } from "react";
import { X, Bot, Send } from "lucide-react";

export default function AiChatWindow() {
  useEffect(() => {
    const closeOnOutsideClick = (e: MouseEvent) => {
      const chatWindow = document.getElementById("ai-chat-window");
      const aiButton = document.getElementById("ai-button");

      if (
        chatWindow &&
        !chatWindow.contains(e.target as Node) &&
        !aiButton?.contains(e.target as Node)
      ) {
        chatWindow.classList.add("hidden");
      }
    };

    document.addEventListener("click", closeOnOutsideClick);
    return () => document.removeEventListener("click", closeOnOutsideClick);
  }, []);

  return (
    <div
      id="ai-chat-window"
      className="hidden fixed bottom-24 right-6 w-96 h-[480px] rounded-2xl overflow-hidden 
                 backdrop-blur-lg bg-slate-900/70 border border-cyan-500/30 shadow-[0_0_30px_rgba(56,189,248,0.4)] 
                 animate-slide-in flex flex-col z-50"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-cyan-500/30 bg-slate-950/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(56,189,248,0.5)]">
            <Bot size={18} className="text-white" />
          </div>
          <h3 className="text-sm font-semibold tracking-wide text-cyan-300">
            Echoo AI Assistant
          </h3>
        </div>
        <button
          onClick={() =>
            document.getElementById("ai-chat-window")?.classList.add("hidden")
          }
          className="p-1.5 rounded-md hover:bg-slate-800/60 transition"
        >
          <X size={16} className="text-gray-400 hover:text-cyan-400" />
        </button>
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto text-sm space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-slate-800/30">
        <div className="flex items-start gap-3">
          <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-xl px-3 py-2 max-w-[80%]">
            <p className="text-cyan-100">
              Hello 👋! I’m Echoo AI — ready to assist you with anything.
            </p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-cyan-500/30 bg-slate-950/40">
        <div className="flex items-center gap-2 bg-slate-900/80 rounded-xl px-3 py-2 border border-cyan-400/30 focus-within:border-cyan-300 transition">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent text-white text-sm placeholder-slate-400 outline-none"
          />
          <button className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-[0_0_10px_rgba(56,189,248,0.5)]">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
