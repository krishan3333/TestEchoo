// app/servers/components/ServerList.tsx
"use client";
import Image from "next/image";
import { Plus, Compass } from "lucide-react";
import { useModal } from "@/app/hooks/use-modal-store"; // Corrected hook name

interface Server {
    id: string;
    name: string;
    imageUrl: string | null;
}

interface ServerListProps {
    servers: Server[];
    activeServerId: string | null;
    setActiveServerId: (id: string) => void;
    openCreateModal: ()=> void // Prop from parent
}

const ServerList: React.FC<ServerListProps> = ({ servers, activeServerId, setActiveServerId, openCreateModal }) => {
  const { onOpen } = useModal(); // Use the hook

  return (
    <div className="h-full w-20 bg-zinc-950 border-r border-zinc-800 flex flex-col items-center py-4 space-y-3 overflow-y-auto">
      {/* Separator */}
      <div className="w-10 h-px bg-zinc-800 mb-2" />

      {/* Server Icons */}
      {servers.map((server) => (
        <div key={server.id} className="relative group flex items-center">
           {/* Active Server Indicator */}
           <div
             className={`absolute left-0 bg-white rounded-r-full transition-all w-1 ${
               activeServerId === server.id ? 'h-10' : 'h-0 group-hover:h-5'
             }`}
           />
          <button
            onClick={() => setActiveServerId(server.id)}
            className={`
              relative flex items-center justify-center w-12 h-12 overflow-hidden
              bg-neutral-700 transition-all duration-200
              ${activeServerId === server.id ? 'rounded-2xl bg-indigo-600' : 'rounded-full group-hover:rounded-2xl group-hover:bg-indigo-600'}
            `}
            title={server.name}
          >
            {server.imageUrl ? (
              <Image
                src={server.imageUrl}
                alt={server.name}
                fill
                className={`${activeServerId === server.id ? 'rounded-2xl' : 'rounded-full group-hover:rounded-2xl'} object-cover transition-all duration-200`}
              />
            ) : (
              // Fallback for servers without images
              <span className="text-white text-lg font-bold">
                {server.name[0].toUpperCase()}
              </span>
            )}
          </button>
        </div>
      ))}

      {/* Separator */}
      <div className="w-10 h-px bg-zinc-800 mt-2" />

      {/* Add Server Button */}
      <button
        onClick={openCreateModal} // Use prop from parent
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 hover:bg-emerald-600 transition-all duration-200"
        title="Add a Server"
      >
        <Plus className="text-emerald-500 group-hover:text-white transition-colors" size={24} />
      </button>

      {/* Join Server Button */}
      <button
        onClick={() => onOpen("joinServer")} // Directly use hook here
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 hover:bg-indigo-600 transition-all"
        title="Join a Server"
      >
        <Compass className="text-indigo-500 group-hover:text-white" size={24} />
      </button>
    </div>
  );
};

export default ServerList;