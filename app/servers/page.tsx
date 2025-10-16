"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { ChannelList, ChatView, MemberList, ServerList } from "./components";
import { onlineMembers } from "./data";
import { useKeyPress } from "@/app/hooks/useKeyPress";
import { Channel } from "./types";

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
            const response = await fetch(`/api/servers/${activeServerId}/channels`);
            if(response.ok) {
                const data: Channel[] = await response.json();
                setChannels(data);
                if (data.length > 0) {
                    setActiveChannelId(data[0].id);
                } else {
                    setActiveChannelId(null);
                }
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
                  avatar="/default-avatar.png"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <h2 className="text-xl font-semibold text-white">No channels here</h2>
                  <p className="text-slate-400 mt-2">Create the first channel to start chatting!</p>
                </div>
              )}
            </div>
            {showMembers && <MemberList onlineMembers={onlineMembers} />}
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