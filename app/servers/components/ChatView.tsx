// app/servers/components/ChatView.tsx
"use client";
import Image from "next/image";
import { Message, User as UserType } from "../types"; // Renamed User to avoid conflict
import { RefObject, useState, useEffect, useRef } from "react";
import { useSocket } from "@/app/components/providers/SocketProvider";
import { Hash, Users } from "lucide-react"; // Added Icons

interface ChatViewProps {
  activeChannelId: string;
  activeChannelName: string;
  showMembers: boolean;
  setShowMembers: (show: boolean) => void;
  messageInputRef: RefObject<HTMLInputElement>;
  avatar: string; // Current user's avatar
  // You'll likely need the current user's ID and name too
  currentUserId?: string; // Example: pass this from parent
  currentUserName?: string; // Example: pass this from parent
}

const ChatView: React.FC<ChatViewProps> = ({
    activeChannelId,
    activeChannelName,
    showMembers,
    setShowMembers,
    messageInputRef,
    avatar,
    currentUserId = 'temp-user-id', // Provide default or pass real ID
    currentUserName = 'You'         // Provide default or pass real name
}) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join the channel room when component mounts or channel changes
    console.log(`Socket joining channel: ${activeChannelId}`);
    socket.emit('join_channel', activeChannelId);

    // Listener for incoming messages
    const messageListener = (newMessage: Message) => {
      console.log('Received message:', newMessage);
      // Ensure the message has necessary fields, potentially map if needed
      const formattedMessage: Message = {
          ...newMessage,
          author: newMessage.author || { id: newMessage.userId, name: newMessage.username, avatar: newMessage.avatar }, // Handle potential structure differences
          timestamp: newMessage.timestamp || new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Format timestamp
      }
      setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    };
    socket.on('receive_message', messageListener);

    // Cleanup on unmount or channel change
    return () => {
      console.log(`Socket leaving channel: ${activeChannelId}`);
      socket.emit('leave_channel', activeChannelId);
      socket.off('receive_message', messageListener);
    };
  }, [socket, isConnected, activeChannelId]);

   // TODO: Add useEffect here to fetch historical messages for activeChannelId via API

  // Send message handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && socket && isConnected) {
      const messageData = { // Structure matches ChatApp's newMessage and includes needed fields
        id: `temp-${Date.now()}`, // Temporary ID, backend should assign real one
        content,
        channelId: activeChannelId,
        userId: currentUserId, // Use the current user's ID
        username: currentUserName, // Use the current user's name
        avatar: avatar, // Use the current user's avatar
        createdAt: new Date().toISOString(), // Timestamp for backend
        // Include author for immediate display, matching Message type
        author: { id: currentUserId, name: currentUserName, avatar: avatar },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      console.log('Sending message:', messageData);
      socket.emit('send_message', messageData);

      // Optimistically add to UI (optional, backend confirmation is better)
      // setMessages((prev) => [...prev, messageData as Message]);

      setContent(""); // Clear input
      messageInputRef.current?.focus(); // Refocus input
    } else if (!isConnected) {
        console.warn("Socket not connected, cannot send message.");
        // Optionally show a UI warning
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-gray-700 overflow-hidden"> {/* Updated background */}
      {/* Channel Header */}
      <div className="h-12 px-4 border-b border-gray-900 flex items-center justify-between bg-gray-800 backdrop-blur-sm"> {/* Updated colors */}
        <div className="flex items-center space-x-2">
            <Hash size={20} className="text-gray-400" />
            <span className="text-white font-medium text-sm">{activeChannelName}</span>
        </div>
        {/* Toggle Members Button */}
        <button onClick={() => setShowMembers(!showMembers)} className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700" title={showMembers ? "Hide Members" : "Show Members"}>
            <Users size={20}/>
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4"> {/* Added more spacing */}
        {/* TODO: Add a loading indicator while fetching historical messages */}
        {messages.map((msg, index) => {
             // Basic grouping: Don't show avatar/name if same author as previous message
             const showHeader = index === 0 || messages[index - 1]?.author.id !== msg.author.id;
             return (
                 <div key={msg.id || index} className={`flex gap-3 items-start ${!showHeader ? 'ml-[52px]' : ''}`}> {/* Indent subsequent messages */}
                 {showHeader && (
                    <Image
                       src={(msg.author?.avatar as string) || "/default-avatar.png"} // Fallback avatar
                       alt={msg.author?.name || 'User'}
                       width={40} // Consistent size
                       height={40}
                       className="rounded-full mt-1" // Added margin top
                     />
                 )}
                 <div className="flex-1">
                 {showHeader && (
                     <div className="flex items-baseline space-x-2 mb-0.5"> {/* Header */}
                         <span className="text-white font-semibold text-sm hover:underline cursor-pointer"> {/* Made name hoverable */}
                           {msg.author?.name || 'Unknown User'}
                         </span>
                         <span className="text-gray-500 text-xs">{msg.timestamp}</span>
                     </div>
                 )}
                   {/* Message Content */}
                   <p className="text-gray-300 text-sm leading-snug">{msg.content}</p> {/* Adjusted line height */}
                 </div>
               </div>
             )
        })}
        {/* Empty div to ensure scrollIntoView works */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-900 p-4 bg-gray-800"> {/* Updated colors */}
        <input
          ref={messageInputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          type="text"
          placeholder={`Message #${activeChannelName}`}
          disabled={!isConnected} // Disable if socket is not connected
          className="w-full bg-gray-600 text-sm text-white rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-400 disabled:opacity-50" // Updated styles
        />
        {/* Add a visual indicator if socket is disconnected */}
        {!isConnected && <p className="text-xs text-red-400 mt-1">Connection lost. Attempting to reconnect...</p>}
      </form>
    </div>
  );
};

export default ChatView;