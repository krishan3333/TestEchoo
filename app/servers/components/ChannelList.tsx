"use client";

import { Plus } from "lucide-react";
import { Channel } from "../types";

interface ChannelListProps {
  currentServer?: { id: string; name?: string };
  channels: Channel[];
  activeChannelId: string | null;
  setActiveChannelId: (id: string) => void;
  isLoading: boolean;
}

const ChannelList: React.FC<ChannelListProps> = ({ currentServer, channels, activeChannelId, setActiveChannelId, isLoading }) => {
  return (
    <div className="h-full w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 text-sm font-semibold text-zinc-300">
        <span>{currentServer?.name || "Server"}</span>
        <button title="Create Channel" className="text-zinc-400 hover:text-white">
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 px-2 py-2 space-y-1">
        {isLoading ? (
          <p className="text-xs text-zinc-400 text-center p-2">Loading Channels...</p>
        ) : (
          <ul>
            {channels.map((channel) => (
              <li key={channel.id}>
                <button
                  onClick={() => setActiveChannelId(channel.id)}
                  className={`w-full text-left text-sm rounded-md px-3 py-1.5 transition-colors ${
                    activeChannelId === channel.id
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <span className="mr-1">#</span> {channel.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChannelList;