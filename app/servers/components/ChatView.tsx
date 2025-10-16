"use client";
import Image from "next/image";
import { Message } from "../types";
import { allChannels } from "../data";
import { RefObject, useState, useEffect } from "react";
import { useSocket } from "@/app/components/providers/SocketProvider";

interface ChatViewProps {
  activeChannel: string;
  // We will manage messages inside this component now
  // messages: Message[];
  showMembers: boolean;
  setShowMembers: (show: boolean) => void;
  messageInputRef: RefObject<HTMLInputElement>;
  avatar: string;
}

const ChatView: React.FC<ChatViewProps> = ({ activeChannel, showMembers, setShowMembers, messageInputRef, avatar }) => {
  const channelName = allChannels.find(c => c.id === activeChannel)?.name || "channel";
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!socket) return;

    // Join the room for the active channel
    socket.emit('join_channel', activeChannel);

    // Listen for incoming messages
    const messageListener = (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    socket.on('receive_message', messageListener);

    // Cleanup on component unmount or when channel changes
    return () => {
      socket.emit('leave_channel', activeChannel);
      socket.off('receive_message', messageListener);
    };
  }, [socket, activeChannel]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && socket) {
      const messageData: Message = {
        id: Date.now(),
        content,
        channelId: activeChannel,
        author: { id: 'current-user-id', name: 'You', avatar: avatar },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: avatar,
        username: 'You'
      };
      socket.emit('send_message', messageData);
      setContent(""); // Clear input after sending
    }
  };


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

      <form onSubmit={handleSendMessage} className="border-t border-zinc-700 p-3">
        <input
          ref={messageInputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          type="text"
          placeholder={`Message #${channelName}`}
          className="w-full bg-zinc-900 text-sm text-white rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </form>
    </div>
  );
};

export default ChatView;
