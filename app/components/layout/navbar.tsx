"use client";

import React, { useEffect } from "react";
import { Bot, Filter, Sparkles } from "lucide-react";
import AiChatWindow from "@/app/dashboard/AI/page";

interface User {
  id: string;
  clerkId: string;
  username: string;
  imageUrl: string | null;
  createdAt: Date | null;
}

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  // Handle AI Chat Toggle
  useEffect(() => {
    const aiButton = document.getElementById("ai-button");
    const chatWindow = document.getElementById("ai-chat-window");

    const toggleChat = () => chatWindow?.classList.toggle("hidden");

    aiButton?.addEventListener("click", toggleChat);
    return () => aiButton?.removeEventListener("click", toggleChat);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-xl border-b border-slate-800/50 shadow-[0_0_20px_rgba(59,130,246,0.25)]">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-400 animate-pulse" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Echoo
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Filter Button */}
            <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition">
              <span>Unified Feed</span>
              <Filter size={16} />
            </button>

            <div className="w-px h-6 bg-slate-700/70" />

            {/* AI Button */}
            <button
              id="ai-button"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 
              hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl shadow-[0_0_12px_rgba(0,212,255,0.5)] 
              transition-all hover:scale-105"
            >
              <Bot size={18} />
              <span>AI</span>
            </button>

            <div className="w-px h-6 bg-slate-700/70" />

            {/* Online Status */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs text-green-400">Online</span>
            </div>
            
            {/* Profile section has been removed from here */}

          </div>
        </div>
      </header>

      {/* Floating AI Chat Window */}
      <AiChatWindow />
    </>
  );
}