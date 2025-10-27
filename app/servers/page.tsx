"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { ChannelList, ChatView, MemberList, ServerList } from "./components";
import { useKeyPress } from "@/app/hooks/useKeyPress";
import { Channel } from "./types";
// Make sure this import is present and correct
import { useModal } from "@/app/hooks/use-modal-store"; // Corrected hook name

interface Server {
    id: string;
    name: string;
    imageUrl: string | null;
}

const ServersView = () => {
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [activeServerId, setActiveServerId] = useState<string | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [showMembers, setShowMembers] = useState(true);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // **** This now matches your modal store file ****
  const { onOpen } = useModal(); // Destructure onOpen from the hook

  // ... (rest of your hooks: handleKPress, handleSlashPress, useKeyPress) ...
    const handleKPress = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) e.preventDefault();
    messageInputRef.current?.focus();
  }, []);

  const handleSlashPress = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    messageInputRef.current?.focus();
  }, []);

  useKeyPress("k", handleKPress);
  useKeyPress("/", handleSlashPress);


  // **** ADD THIS FUNCTION ****
  // This function will update the client-side state
  const addServerToList = (newServer: Server) => {
    setServers((currentServers) => [...currentServers, newServer]);
    // Optionally select the new server immediately
    setActiveServerId(newServer.id);
  };
  // **** END OF NEW FUNCTION ****


  // ... (rest of your useEffect hooks and component logic) ...
   useEffect(() => {
    const fetchServers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/server');
        if (response.ok) {
          const data: Server[] = await response.json();
          setServers(data);
          if (data.length > 0 && !activeServerId) {
            setActiveServerId(data[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch servers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServers();
  }, []);

  useEffect(() => {
    if (!activeServerId) return;

    const fetchChannels = async () => {
        setIsLoadingChannels(true);
        try {
            const response = await fetch(`/api/server/${activeServerId}?type=channels`);
            if(response.ok) {
                const data: Channel[] = await response.json();
                setChannels(data);
                setActiveChannelId(data[0]?.id || null); // Set first channel or null
            } else {
                 throw new Error(`Failed to fetch channels: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Failed to fetch channels:", error);
            setChannels([]);
            setActiveChannelId(null);
        } finally {
            setIsLoadingChannels(false);
        }
    };

    fetchChannels();
  }, [activeServerId]);


  const currentServer = servers.find((s) => s.id === activeServerId);

  // **** MODIFY THIS HANDLER ****
  const handleOpenCreateModal = () => {
    // Pass the callback function as part of the data object
    onOpen('createServer', { onSuccess: addServerToList });
  };
  // **** END OF MODIFICATION ****


  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-zinc-900 text-zinc-100 items-center justify-center">
        <p>Loading Your Universe...</p>
      </div>
    );
  }


  return (
    <div className="flex h-screen w-full bg-zinc-900 text-zinc-100">
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
        <ServerList
          servers={servers}
          activeServerId={activeServerId}
          setActiveServerId={setActiveServerId}
          openCreateModal={handleOpenCreateModal} // Pass the modified handler
        />

         {currentServer ? (
          <>
            <ChannelList
              currentServer={currentServer}
              channels={channels}
              activeChannelId={activeChannelId}
              setActiveChannelId={setActiveChannelId}
              isLoading={isLoadingChannels}
            />
            <div className="flex-1 flex flex-col">
              {activeChannelId ? (
                <ChatView
                  key={activeChannelId}
                  activeChannelId={activeChannelId}
                  activeChannelName={channels.find(c => c.id === activeChannelId)?.name || ''}
                  showMembers={showMembers}
                  setShowMembers={setShowMembers}
                  messageInputRef={messageInputRef as React.RefObject<HTMLInputElement>}
                  avatar="/default-avatar.png" // This should be the current user's avatar
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <h2 className="text-xl font-semibold text-white">No channels here yet!</h2>
                  <p className="text-slate-400 mt-2">{isLoadingChannels ? 'Loading channels...' : 'Maybe create one?'}</p>
                </div>
              )}
            </div>
             {showMembers && activeServerId && (
              <MemberList serverId={activeServerId}  />
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-2xl font-semibold text-white">Welcome to Echoo</h2>
            <p className="text-slate-400 mt-2">You haven&apos;t joined any servers yet.</p>
            <p className="text-slate-400">Click the &apos;+&apos; to create or the compass to join one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServersView;
