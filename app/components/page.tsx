"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Search, MessageSquare, MoreVertical, UserPlus, X, Check } from "lucide-react";

// 1. EXPANDED TYPES
// =========================
type Status = "Online" | "Offline" | "Pending" | "Blocked";
type Filter = "All" | "Online" | "Pending" | "Blocked";

type Friend = {
  id: number;
  name: string;
  avatarUrl: string;
  status: Status;
  activity: string; // Added for more context
};

// 2. EXPANDED MOCK DATA
// =========================
const friendsData: Friend[] = [
  { id: 1, name: "Roronoa Zoro", avatarUrl: "/avatars/zoro.png", status: "Online", activity: "Training" },
  { id: 2, name: "Monkey D. Luffy", avatarUrl: "/avatars/luffy.png", status: "Online", activity: "Eating" },
  { id: 3, name: "Nami", avatarUrl: "/avatars/nami.png", status: "Online", activity: "Drawing maps" },
  { id: 4, name: "Sanji", avatarUrl: "/avatars/sanji.png", status: "Offline", activity: "Last seen 2 hours ago" },
  { id: 5, name: "Usopp", avatarUrl: "/avatars/usopp.png", status: "Offline", activity: "Last seen 45 minutes ago" },
  { id: 6, name: "Nico Robin", avatarUrl: "/avatars/robin.png", status: "Pending", activity: "Incoming friend request" },
  { id: 7, name: "Buggy", avatarUrl: "/avatars/buggy.png", status: "Blocked", activity: "Blocked" },
];

// 3. REUSABLE FriendRow COMPONENT
// ================================
// This component renders a single friend row,
// with styles and actions logic based on their status.
const FriendRow = ({ friend }: { friend: Friend }) => {
  const isInteractable = friend.status === "Online" || friend.status === "Offline";
  const isPending = friend.status === "Pending";
  const isBlocked = friend.status === "Blocked";
  const isOffline = friend.status === "Offline" || friend.status === "Blocked";

  return (
    <li className="flex items-center  justify-between bg-gray hover:bg-gray-500 p-2 rounded-md shadow-sm transition">
      <div className="flex items-center gap-3">
        <Image
          src={friend.avatarUrl}
          alt={friend.name}
          width={40}
          height={40}
          className={`rounded-full ${isOffline ? "grayscale" : ""}`}
        />
        <div>
          <p className={`font-medium ${isOffline ? "text-gray-600" : "text-gray-900"}`}>
            {friend.name}
          </p>
          <p className={`text-xs ${
            friend.status === "Online" ? "text-green-500" :
            isPending ? "text-blue-500" : "text-gray-400"
          }`}>
            {friend.activity}
          </p>
        </div>
      </div>
      
      {/* Conditional Actions */}
      <div className="flex items-center gap-3">
        {isInteractable && (
          <>
            <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full">
              <MessageSquare size={18} className="text-gray-700" />
            </button>
            <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full">
              <MoreVertical size={18} className="text-gray-700" />
            </button>
          </>
        )}
        {isPending && (
          <>
            <button className="p-2 bg-green-100 hover:bg-green-200 rounded-full">
              <Check size={18} className="text-green-700" />
            </button>
            <button className="p-2 bg-red-100 hover:bg-red-200 rounded-full">
              <X size={18} className="text-red-700" />
            </button>
          </>
        )}
        {isBlocked && (
          <button className="p-2 bg-red-100 hover:bg-red-200 rounded-full">
            <X size={18} className="text-red-700" />
          </button>
        )}
      </div>
    </li>
  );
};

// 4. REUSABLE FriendListSection COMPONENT
// ================================
// This component renders a title and a list of friends.
const FriendListSection = ({ title, friends }: { title: string; friends: Friend[] }) => {
  if (friends.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xs font-semibold text-gray-500 mb-2 uppercase">
        {title} - {friends.length}
      </h2>
      <ul className="space-y-2">
        {friends.map((friend) => (
          <FriendRow key={friend.id} friend={friend} />
        ))}
      </ul>
    </section>
  );
};

// 5. MAIN FriendsList COMPONENT
// ================================
const FriendsList = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  // Filter logic: first by search, then create lists
  const searchedFriends = friendsData.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const onlineFriends = searchedFriends.filter((f) => f.status === "Online");
  const offlineFriends = searchedFriends.filter((f) => f.status === "Offline");
  const pendingFriends = searchedFriends.filter((f) => f.status === "Pending");
  const blockedFriends = searchedFriends.filter((f) => f.status === "Blocked");

  // Helper for button styling
  const getButtonClass = (filterName: Filter) => {
    const baseClass = "px-4 py-1.5 text-sm rounded-md transition";
    if (activeFilter === filterName) {
      return `${baseClass} bg-blue-600 text-white`;
    }
    return `${baseClass} bg-gray-100 hover:bg-gray-200 text-gray-700`;
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans">
      {/* Header bar */}
      <header className="flex justify-between items-center px-6 py-3 border-b bg-white">
        <h1 className="text-lg font-semibold">Friends</h1>
        <div className="flex flex-wrap gap-2">
          {/* Add onClick handlers and dynamic classes */}
          {(["All", "Online", "Pending", "Blocked"] as Filter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={getButtonClass(filter)}
            >
              {filter}
            </button>
          ))}
          <button className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md flex items-center gap-1">
            <UserPlus size={16} /> Add Friend
          </button>
        </div>
      </header>

      {/* Search bar (unchanged) */}
      <div className="p-4 border-b bg-white flex items-center gap-2">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      {/* Friends sections - Now with conditional rendering */}
      <main className="p-4">
        {activeFilter === "All" && (
          <>
            <FriendListSection title="Online" friends={onlineFriends} />
            <FriendListSection title="Offline" friends={offlineFriends} />
            <FriendListSection title="Pending" friends={pendingFriends} />
          </>
        )}
        
        {activeFilter === "Online" && (
          <FriendListSection title="Online" friends={onlineFriends} />
        )}
        
        {activeFilter === "Pending" && (
          <FriendListSection title="Pending" friends={pendingFriends} />
        )}

        {activeFilter === "Blocked" && (
          <FriendListSection title="Blocked" friends={blockedFriends} />
        )}
      </main>

      {/* Footer (unchanged) */}
      <footer className="text-xs text-gray-400 text-center mt-6 mb-2">
        Echoo © 2025
      </footer>
    </div>
  );
};

export default FriendsList;