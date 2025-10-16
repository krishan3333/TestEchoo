import { Server, Channel, Message, User } from "@/app/dashboard/servers/types";

export const servers: Server[] = [
  {
    id: 1,
    name: "Design Team",
    avatar: "",
    color: "#8B5CF6",
    icon: "",
  },
  {
    id: 2,
    name: "Dev Community",
    avatar: "",
    color: "#3B82F6",
    icon: "",
  },
  {
    id: 3,
    name: "Marketing Hub",
    avatar: "",
    color: "#F59E0B",
    icon: "",
  },
];

export const allChannels: Channel[] = [
  { id:"1", type: "text", name: "general", unread: 2, serverId: 1 },
  { id:"2", type: "text", name: "announcements", unread: 0, serverId: 1 },
  { id:"3", type: "voice", name: "Team Meeting", members: 5, serverId: 1 },

  { id:"4", type: "text", name: "frontend", unread: 1, serverId: 2 },
  { id:"5", type: "voice", name: "Code Review", members: 3, serverId: 2 },

  { id:"6", type: "text", name: "strategy", unread: 4, serverId: 3 },
  { id:"7", type: "voice", name: "Marketing Call", members: 2, serverId: 3 },
];

export const messages: Message[] = [
  {
    id: 1,
    author: {
      id: 1,
      name: "Sarah Chen",
      avatar: "",
    },
    avatar: "",
    username: "Sarah Chen",
    content: "Hey everyone 👋 Excited for the meeting today?",
    timestamp: "10:30 AM",
  },{
    id: 2,
    author: {
      id: 2,
      name: "Liam Patel",
      avatar: "",
    },
    avatar: "",
    username: "Liam Patel",
    content: "Absolutely! Let's finalize the new feature roadmap 🚀",
    timestamp: "10:32 AM",
  },{
    id: 3,
    author: {
      id: 3,
      name: "Ava Johnson",
      avatar: "",
    },
    avatar: "",
    username: "Ava Johnson",
    content: "Can someone update the Figma file?",
    timestamp: "10:35 AM",
  },
]
   


export const onlineMembers: User[] = [
  {
    id: 1,
    name: "KRISHAN SINGH POONIA",
    avatar: "",
    status: "Online",
  },
  {
    id: 2,
    name: "MAYANK",
    avatar: "",
    status: "Online",
  },
  {
    id: 3,
    name: "Ava Johnson",
    avatar: "",
    status: "Idle",
  },
  {
    id: 4,
    name: "Ethan Smith",
    avatar: "",
    status: "Offline",
  },
];
