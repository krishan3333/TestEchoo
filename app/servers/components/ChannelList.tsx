"use client";

interface Channel {
  id: string;
  name: string;
}

interface ChannelListProps {
  currentServer?: { name?: string };
  channels: Channel[];
  activeChannel: string;
  setActiveChannel: (id: string) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({ currentServer, channels, activeChannel, setActiveChannel }) => {
  return (
    <div className=" h-full w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-y-auto">
      <div className="px-4 py-3 border-b border-zinc-800 text-sm font-semibold text-zinc-300">
        {currentServer?.name || "Server"}
      </div>
      <ul className="flex-1 px-2 py-2 space-y-1">
        {channels.map((channel) => (
          <li key={channel.id}>
            <button
              onClick={() => setActiveChannel(channel.id)}
              className={`w-full text-left text-sm rounded-md px-3 py-1.5 transition-colors ${
                activeChannel === channel.id
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
              }`}
            >
              # {channel.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;
