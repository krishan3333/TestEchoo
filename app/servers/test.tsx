// "use client";

// import React from "react";
// import {
//   Hash,
//   Volume2,
//   Users,
//   Settings,
//   Plus,
//   Send,
//   Smile,
//   Paperclip,
//   ChevronDown,
//   PlusCircle,
//   Search,
//   Bell,
//   Crown,
//   Shield,
// } from "lucide-react";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/app/components/ui/avatar";
// import { Button } from "@/app/components/ui/button";
// import { Input } from "@/app/components/ui/input";
// import { ScrollArea } from "@/app/components/ui/scroll-area";
// import { Badge } from "@/app/components/ui/badge";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/app/components/ui/tooltip";
// import { Server, Channel, Message, User, TextChannel } from "@/app/servers/types";

// // --- REFINED STYLING CONSTANTS ---
// const glass = "bg-zinc-900/60 backdrop-blur-xl border border-white/10";
// const hover = "hover:bg-zinc-800/60 transition-all duration-200";
// const textSoft = "text-zinc-400 hover:text-zinc-100 transition-colors";

// export const ServerList = ({ servers, activeServer, setActiveServer }: any) => (
//   <aside className="w-20 flex flex-col items-center py-4 bg-zinc-950/80 border-r border-zinc-800 shadow-lg">
//     <ScrollArea className="flex-1 w-full">
//       <div className="flex flex-col items-center gap-3">
//         {servers.map((server: any) => (
//           <TooltipProvider key={server.id}>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <button
//                   onClick={() => setActiveServer(server.id)}
//                   className={`relative w-14 h-14 rounded-2xl transition-all hover:scale-105 ${
//                     activeServer === server.id
//                       ? "ring-2 ring-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.5)]"
//                       : "hover:ring-1 hover:ring-zinc-700"
//                   }`}
//                 >
//                   <img
//                     src={server.avatar}
//                     alt={server.name}
//                     className="w-full h-full rounded-2xl object-cover"
//                   />
//                 </button>
//               </TooltipTrigger>
//               <TooltipContent side="right" className="text-sm">
//                 {server.name}
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         ))}

//         <button className="mt-2 w-14 h-14 rounded-2xl bg-zinc-800 hover:bg-violet-600 text-zinc-400 hover:text-white flex items-center justify-center shadow-inner hover:shadow-violet-500/20 transition-all">
//           <PlusCircle className="h-6 w-6" />
//         </button>
//       </div>
//     </ScrollArea>
//   </aside>
// );

// export const ChannelList = ({
//   currentServer,
//   channels,
//   activeChannel,
//   setActiveChannel,
// }: any) => {
//   const [searchQuery, setSearchQuery] = React.useState("");
//   const filteredChannels = channels.filter((c: any) =>
//     c.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <aside className={`w-64 flex flex-col ${glass}`}>
//       <div className="p-4 border-b border-white/10">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <img
//               src={currentServer?.avatar}
//               className="w-8 h-8 rounded-md"
//               alt="Server"
//             />
//             <h2 className="font-semibold text-white">{currentServer?.name}</h2>
//           </div>
//           <ChevronDown className="h-4 w-4 text-zinc-400" />
//         </div>
//         <div className="mt-3 relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
//           <Input
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 h-8 bg-zinc-800/50 border-none text-sm"
//           />
//         </div>
//       </div>

//       <ScrollArea className="flex-1 p-3">
//         <div className="space-y-4">
//           <div>
//             <span className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">
//               Text Channels
//             </span>
//             <div className="space-y-1">
//               {filteredChannels
//                 .filter((c: any) => c.type === "text")
//                 .map((c: any) => (
//                   <button
//                     key={c.name}
//                     onClick={() => setActiveChannel(c.name)}
//                     className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg ${
//                       activeChannel === c.name
//                         ? "bg-violet-600/20 text-violet-400"
//                         : textSoft + " " + hover
//                     }`}
//                   >
//                     <Hash className="h-4 w-4" />
//                     <span className="truncate text-sm">{c.name}</span>
//                   </button>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </ScrollArea>
//     </aside>
//   );
// };

// export const ChatView = ({
//   activeChannel,
//   showMembers,
//   setShowMembers,
//   messages,
//   messageInputRef,
// }: any) => (
//   <div className="flex-1 flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
//     <header className="h-14 flex items-center justify-between px-6 border-b border-zinc-800 bg-zinc-900/70 backdrop-blur-md">
//       <div className="flex items-center gap-3">
//         <Hash className="h-5 w-5 text-violet-400" />
//         <h3 className="font-medium text-white capitalize">
//           {activeChannel}
//         </h3>
//       </div>
//       <div className="flex items-center gap-2">
//         <Bell className="h-4 w-4 text-zinc-400 hover:text-violet-400" />
//         <Users
//           onClick={() => setShowMembers(!showMembers)}
//           className="h-4 w-4 text-zinc-400 hover:text-violet-400 cursor-pointer"
//         />
//         <Settings className="h-4 w-4 text-zinc-400 hover:text-violet-400" />
//       </div>
//     </header>

//     <ScrollArea className="flex-1 px-6 py-4">
//       <div className="space-y-5 max-w-3xl mx-auto">
//         {messages.map((msg: any) => (
//           <div
//             key={msg.id}
//             className="flex gap-3 hover:bg-zinc-800/30 rounded-lg p-3"
//           >
//             <Avatar className="h-9 w-9 ring-1 ring-zinc-700">
//               <AvatarImage src={msg.author.avatar} />
//               <AvatarFallback>{msg.author.name[0]}</AvatarFallback>
//             </Avatar>
//             <div>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-semibold text-white">
//                   {msg.author.name}
//                 </span>
//                 <span className="text-xs text-zinc-500">{msg.timestamp}</span>
//               </div>
//               <p className="text-sm text-zinc-300">{msg.content}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </ScrollArea>

//     <footer className="border-t border-zinc-800 bg-zinc-900/60 backdrop-blur-md p-3">
//       <div className="flex items-center gap-3 bg-zinc-800/50 rounded-xl px-3 py-2">
//         <Plus className="h-5 w-5 text-zinc-400 hover:text-violet-400" />
//         <Input
//           ref={messageInputRef}
//           placeholder={`Message #${activeChannel}`}
//           className="bg-transparent border-none text-sm focus:ring-0"
//         />
//         <div className="flex items-center gap-2">
//           <Smile className="h-4 w-4 text-zinc-400 hover:text-violet-400" />
//           <Paperclip className="h-4 w-4 text-zinc-400 hover:text-violet-400" />
//           <Button
//             size="icon"
//             className="bg-violet-600 hover:bg-violet-700 rounded-full h-8 w-8"
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </footer>
//   </div>
// );
