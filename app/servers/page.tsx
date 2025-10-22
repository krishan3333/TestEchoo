// app/servers/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { ChannelList, ChatView, MemberList, ServerList } from "./components";
import { useKeyPress } from "@/app/hooks/useKeyPress";
import { Channel } from "./types";
import { useModal } from "@/app/hooks/use-modal-store"; // For opening modals

interface Server {
    id: string;
    name: string;
    imageUrl: string | null;
}

const ServersView = () => {
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoadingServers, setIsLoadingServers] = useState(true);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [activeServerId, setActiveServerId] = useState<string | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [showMembers, setShowMembers] = useState(true);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const { onOpen } = useModal(); // Hook for modals

  // Hook for keyboard shortcuts
  const handleKPress = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) e.preventDefault();
    messageInputRef.current?.focus();
  }, []);
  useKeyPress("k", handleKPress);
  // Add other key press handlers if needed...

  // Fetch Servers on initial load
  useEffect(() => {
    const fetchServers = async () => {
      setIsLoadingServers(true);
      try {
        const response = await fetch('/api/server'); // API call
        if (response.ok) {
          const data: Server[] = await response.json();
          setServers(data);
          if (data.length > 0 && !activeServerId) {
            setActiveServerId(data[0].id); // Select first server initially
          }
        } else {
            console.error("Failed to fetch servers:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching servers:", error);
      } finally {
        setIsLoadingServers(false);
      }
    };
    fetchServers();
  }, []); // Empty dependency array means run once on mount

  // Fetch Channels when activeServerId changes
  useEffect(() => {
    if (!activeServerId) {
        setChannels([]); // Clear channels if no server selected
        setActiveChannelId(null);
        return;
    };
    const fetchChannels = async () => {
      setIsLoadingChannels(true);
      try {
        // API call to get channels for the active server
        const response = await fetch(`/api/server/${activeServerId}?type=channels`);
        if(response.ok) {
          const data: Channel[] = await response.json();
          setChannels(data);
          // Select the first channel automatically
          setActiveChannelId(data[0]?.id || null);
        } else {
             console.error(`Failed to fetch channels: ${response.statusText}`);
             setChannels([]);
             setActiveChannelId(null);
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
        setChannels([]);
        setActiveChannelId(null);
      } finally {
        setIsLoadingChannels(false);
      }
    };
    fetchChannels();
  }, [activeServerId]); // Re-run when activeServerId changes

  // Modal Handling
  const handleOpenCreateModal = () => {
    onOpen('createServer'); // Uses the Zustand modal store
  };
  const handleOpenJoinModal = () => {
    onOpen('joinServer');
  };

  const currentServer = servers.find((s) => s.id === activeServerId);

  // Loading State
  if (isLoadingServers) {
    return (
        <div className="flex h-screen w-full bg-zinc-900 text-zinc-100 items-center justify-center">
            <p>Loading Your Servers...</p>
        </div>
    );
  }

  // Main Render
  return (
    <div className="flex h-screen w-full bg-zinc-900 text-zinc-100">
       {/* Header Bar */}
       <div className="absolute top-0 left-0 right-0 h-12 bg-zinc-900/70 backdrop-blur-md border-b border-zinc-800 z-50 flex items-center px-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors text-sm font-medium"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </button>
      </div>

      <div className="pt-12 w-full flex flex-1">
          {/* Server List Panel */}
          <ServerList
            servers={servers}
            activeServerId={activeServerId}
            setActiveServerId={setActiveServerId}
            openCreateModal={handleOpenCreateModal} // Pass handlers to child
          />

          {/* Conditional Rendering based on selected server */}
          {currentServer ? (
            <>
              {/* Channel List Panel */}
              <ChannelList
                currentServer={currentServer}
                channels={channels}
                activeChannelId={activeChannelId}
                setActiveChannelId={setActiveChannelId}
                isLoading={isLoadingChannels}
                // Add Create Channel Modal Trigger Here
              />
              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {activeChannelId ? (
                  <ChatView
                    key={activeChannelId} // Re-mount when channel changes
                    activeChannelId={activeChannelId}
                    activeChannelName={channels.find(c => c.id === activeChannelId)?.name || ''}
                    showMembers={showMembers}
                    setShowMembers={setShowMembers}
                    messageInputRef={messageInputRef as React.RefObject<HTMLInputElement>}
                    avatar="/default-avatar.png" // Replace with actual user avatar logic
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                     <h2 className="text-xl font-semibold text-white">No Channel Selected</h2>
                     <p className="text-slate-400 mt-2">
                        {isLoadingChannels ? 'Loading channels...' : (channels.length > 0 ? 'Select a channel to start chatting!' : 'This server has no channels yet!')}
                     </p>
                  </div>
                )}
              </div>
              {/* Member List Panel (Conditional) */}
              {showMembers && activeServerId && (
                <MemberList serverId={activeServerId} />
              )}
            </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-2xl font-semibold text-white">Welcome to Echoo</h2>
                <p className="text-slate-400 mt-2">You haven't joined any servers yet.</p>
                <p className="text-slate-400">Click the '+' to create or the compass to join one!</p>
             </div>
          )}
      </div>
    </div>
  );
};

export default ServersView;