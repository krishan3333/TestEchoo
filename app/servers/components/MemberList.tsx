"use client";
import Image from "next/image";
import { User } from "@/app/servers/types";


interface MemberListProps {
  onlineMembers: User[];
}


const MemberList = ({ onlineMembers }: MemberListProps) => {
  return (
    <div className=" h-full w-64 bg-zinc-900 border-l border-zinc-800 flex flex-col overflow-y-auto">
      <div className="px-4 py-3 border-b border-zinc-800 text-sm font-medium text-zinc-400">
        ONLINE — {onlineMembers.length}
      </div>
      <ul className="flex-1 px-3 py-2 space-y-2">
        {onlineMembers.map((member) => (
          <li
            key={member.id}
            className="flex items-center gap-3 text-zinc-300 hover:bg-zinc-800/70 rounded-md px-2 py-1 transition-colors"
          >
            <Image src={member.avatar} alt={member.name} width={32} height={32} className="rounded-full" />
            <span className="text-sm font-medium">{member.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;
