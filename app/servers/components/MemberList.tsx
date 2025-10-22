// app/servers/components/MemberList.tsx
"use client";
import Image from "next/image";
import { User } from "../types"; // Using the User type from types.ts
import { useState, useEffect } from "react";
import { Crown, Shield } from "lucide-react"; // Icons for roles

interface Member extends User {
    role?: 'owner' | 'admin' | 'guest'; // Add role from your data
    user_id: string; // Ensure this matches the structure from API
}

interface MemberListProps {
  serverId: string | null; // Allow null if no server selected
}


const MemberList: React.FC<MemberListProps> = ({ serverId }) => {
  const [members, setMembers] = useState<Member[]>([]); // Use Member type
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () =>{
      if (!serverId) {
          setMembers([]); // Clear members if no server is selected
          return;
      };
      setIsLoading(true);
      try{
        const response = await fetch(`/api/server/${serverId}?type=members`);
        if (response.ok){
          const data = await response.json();
          // Assuming API returns { id, name, avatar, role (optional) }
          // Map data to ensure structure matches Member type
           const formattedMembers = data.map((m: any) => ({
             id: m.id, // Assuming API returns 'id'
             user_id: m.id, // If user_id is the same as the user's primary id
             name: m.name,
             avatar: m.avatar || "/default-avatar.png", // Fallback avatar
             status: m.status || "Offline", // Assuming API provides status
             role: m.role?.toLowerCase() || 'guest' // Assuming API provides role, default to guest
           }));
          setMembers(formattedMembers);
        } else {
             console.error("Failed to fetch members:", response.statusText);
             setMembers([]); // Clear on error
        }
      } catch(error){
        console.error("Error fetching members:", error);
        setMembers([]); // Clear on error
      } finally {
          setIsLoading(false);
      }
    };
    fetchMembers();
  }, [serverId]); // Re-fetch when serverId changes


  return (
    <div className="h-full w-60 bg-gray-800 border-l border-gray-900 flex flex-col overflow-y-auto"> {/* Updated colors */}
      {/* Header showing member count */}
      <div className="px-4 py-3 border-b border-gray-900 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Members — {isLoading ? '...' : members.length}
      </div>

      {/* Member List */}
      <ul className="flex-1 px-2 py-2 space-y-1">
        {isLoading ? (
             <p className="text-center text-gray-500 text-sm p-4">Loading members...</p>
        ) : members.length === 0 && serverId ? (
            <p className="text-center text-gray-500 text-sm p-4">No members found.</p>
        ) : (
          members.map((member) => (
            <li
              key={member.user_id || member.id} // Use user_id or id as key
              className="flex items-center gap-3 text-gray-300 hover:bg-gray-700/70 rounded-md px-2 py-1.5 transition-colors group" // Adjusted padding
            >
              {/* Avatar with Status Indicator */}
              <div className="relative flex-shrink-0">
                  <Image
                      src={member.avatar as string} // Cast avatar to string
                      alt={member.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                  />
                   {/* Status Dot */}
                   <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                       member.status === 'Online' ? 'bg-green-500' : 'bg-gray-500' // Example status logic
                   }`} />
              </div>

              {/* Name and Role Icon */}
              <div className="flex items-center space-x-1 overflow-hidden">
                <span className="text-sm font-medium truncate group-hover:text-white">{member.name}</span>
                {/* Role Icons - Wrap icons in a span with the title attribute */}
                {member.role === 'owner' && (
                  <span title="Server Owner"> {/* Wrap the icon */}
                    <Crown size={14} className="text-yellow-500 flex-shrink-0" />
                  </span>
                )}
                {member.role === 'admin' && (
                  <span title="Admin"> {/* Wrap the icon */}
                    <Shield size={14} className="text-blue-500 flex-shrink-0" />
                  </span>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default MemberList;