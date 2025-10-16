"use client";
import Image from "next/image";
import { Message } from "../types";
import { allChannels } from "../data";

// Import RefObject from React
import { RefObject } from "react";

interface ChatViewProps {
  activeChannel: string;
  messages: Message[];
  showMembers: boolean;
  setShowMembers: (show: boolean) => void;
  // This type is now correct for a ref created with useRef(null)
  messageInputRef: RefObject<HTMLInputElement>;
  avatar: string;
}


const ChatView: React.FC<ChatViewProps> = ({ activeChannel, showMembers, setShowMembers, messages, messageInputRef }) => {
  const channelName = allChannels.find(c => c.id === activeChannel)?.name || "channel";

  return (
    <div className="flex flex-col flex-1 h-full bg-zinc-800 overflow-hidden">
      <div className="h-12 px-4 border-b border-zinc-700 flex items-center justify-between bg-zinc-900/80 backdrop-blur-sm">
        <span className="text-white font-medium text-sm"># {channelName}</span>
        <button onClick={() => setShowMembers(!showMembers)} className="text-zinc-400 hover:text-white text-sm">
          {showMembers ? "Hide Members" : "Show Members"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3 items-start">
            <Image src={msg.avatar} alt={msg.author.name} width={36} height={36} className="rounded-full" />
            <div>
              <div className="text-sm text-white font-medium">
                {msg.author.name}
                <span className="text-xs text-zinc-500 ml-2">{msg.timestamp}</span>
              </div>
              <p className="text-sm text-zinc-300">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-700 p-3">
        <input
          ref={messageInputRef}
          type="text"
          placeholder={`Message #${channelName}`}

          className="w-full bg-zinc-900 text-sm text-white rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export default ChatView;