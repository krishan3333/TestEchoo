import type { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface Server {
    icon: string | StaticImport;
    id: string;
    name: string;
    avatar: string;
    color: string;
  }
  
  export interface TextChannel {
    type: "text";
    name: string;
    unread: number;
    serverId: number;
  }
  
  export interface VoiceChannel {
    type: "voice";
    name: string;
    members: number;
    serverId: number;
  }
  
 export interface Channel {
  id: string;
  type: "TEXT" | "VOICE";
  name: string;
  serverId: string; 
  unread?: number;
  members?: number;
}

  
  export interface User {
  id: string | number;
  name: string;
  avatar: string;
  status: "Online" | "Idle" | "Offline";
}
  
  export interface Message {
    id: number | string;
    content: string;
    channelId: string; 
    author: Omit<User, 'status'>;
    timestamp: string;
    avatar: string | StaticImport;
    username: string;
    roles?: string[];
  }
