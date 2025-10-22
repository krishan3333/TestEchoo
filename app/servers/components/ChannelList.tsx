// app/servers/components/ChannelList.tsx
"use client";

import { Plus, Hash } from "lucide-react";
import { Channel } from "../types";
// Import useModal if you add create channel functionality
// import { useModal } from "@/app/hooks/use-modal-store";

interface ChannelListProps {
  currentServer?: { id: string; name?: string }; // Make optional if needed
  channels: Channel[];
  activeChannelId: string | null;
  setActiveChannelId: (id: string) => void;
  isLoading: boolean;
  // Add openCreateChannelModal prop if implementing creation
}

const ChannelList: React.FC<ChannelListProps> = ({
  currentServer,
  channels,
  activeChannelId,
  setActiveChannelId,
  isLoading
}) => {
  // const { onOpen } = useModal(); // Uncomment if adding create channel

  return (
    <div className="h-full w-60 bg-gray-800 flex flex-col overflow-y-auto"> {/* Updated background */}
      {/* Server Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 text-sm font-semibold text-white"> {/* Updated styles */}
        <span>{currentServer?.name || "Server"}</span>
        {/* Add Create Channel Button Here if needed */}
         <button
            // onClick={() => onOpen('createChannel', { serverId: currentServer?.id })} // Example usage
            title="Create Channel"
            className="text-gray-400 hover:text-white"
         >
           <Plus size={16} />
         </button>
      </div>

      {/* Channel List Area */}
      <div className="flex-1 px-2 py-2 space-y-1">
        <div className="flex items-center justify-between px-2 py-1">
             <span className="text-gray-400 text-xs font-semibold uppercase">Text Channels</span>
             {/* Potential Add Button if not in header */}
        </div>
        {isLoading ? (
          <p className="text-xs text-gray-400 text-center p-2">Loading Channels...</p>
        ) : channels.length === 0 ? (
             <p className="text-xs text-gray-500 text-center p-2">No text channels yet.</p>
        ) : (
          <ul>
            {channels.filter(c => c.type === 'TEXT').map((channel) => ( // Assuming type 'TEXT'
              <li key={channel.id}>
                <button
                  onClick={() => setActiveChannelId(channel.id)}
                  className={`w-full flex items-center space-x-2 text-left text-sm rounded-md px-2 py-1.5 transition-colors ${ // Updated padding/spacing
                    activeChannelId === channel.id
                      ? "bg-gray-700 text-white" // Active state
                      : "text-gray-400 hover:bg-gray-700/60 hover:text-white" // Inactive state
                  }`}
                >
                  <Hash size={18} />
                  <span>{channel.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
         {/* Add Voice Channels section similarly if needed */}
      </div>
       {/* User Area at the bottom (Consider moving to a separate component or layout) */}
        {/* <div className="p-4 bg-gray-900 flex items-center justify-between mt-auto"> ... User Info ... </div> */}
    </div>
  );
};

export default ChannelList;