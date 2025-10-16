"use client";
import Image from "next/image";
import { Message } from "../types";
import { RefObject, useState, useEffect } from "react";
import { useSocket } from "@/app/components/providers/SocketProvider";

interface ChatViewProps {
  activeChannelId: string;
  activeChannelName: string;
  showMembers: boolean;
  setShowMembers: (show: boolean) => void;
  messageInputRef: RefObject<HTMLInputElement>;
  avatar: string;
}

const ChatView: React.FC<ChatViewProps> = ({ activeChannelId, activeChannelName, showMembers, setShowMembers, messageInputRef, avatar }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!socket) return;

    socket.emit('join_channel', activeChannelId);

    const messageListener = (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    socket.on('receive_message', messageListener);

    return () => {
      socket.emit('leave_channel', activeChannelId);
      socket.off('receive_message', messageListener);
    };
  }, [socket, activeChannelId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && socket) {
      const messageData: Message = {
        id: Date.now(),
        content,
        channelId: activeChannelId,
        author: { id: 'current-user-id', name: 'You', avatar: avatar }, // Placeholder user
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: avatar,
        username: 'You'
      };
      socket.emit('send_message', messageData);
      setContent("");
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-zinc-800 overflow-hidden">
      <div className="h-12 px-4 border-b border-zinc-700 flex items-center justify-between bg-zinc-900/80 backdrop-blur-sm">
        <span className="text-white font-medium text-sm"># {activeChannelName}</span>
        <button onClick={() => setShowMembers(!showMembers)} className="text-zinc-400 hover:text-white text-sm">
          {showMembers ? "Hide Members" : "Show Members"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3 items-start">
            <Image src={msg.avatar as string} alt={msg.author.name} width={36} height={36} className="rounded-full" />
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

      <form onSubmit={handleSendMessage} className="border-t border-zinc-700 p-3">
        <input
          ref={messageInputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          type="text"
          placeholder={`Message #${activeChannelName}`}
          className="w-full bg-zinc-900 text-sm text-white rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </form>
    </div>
  );
};

export default ChatView;