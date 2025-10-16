// This directive is necessary for components that use client-side hooks like useState.
'use client';
import React, { useState, KeyboardEvent } from 'react';

// --- TYPE DEFINITIONS ---
// Defines the structure for a friend object for type safety.
interface Friend {
  name: string;
  avatarUrl: string;
}

// --- SVG ICON COMPONENT ---
// A reusable SVG icon component for the "Add Friend" button.
const AddFriendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

// --- FRIEND LIST ITEM COMPONENT ---
// A component to display a single friend in the list.
const FriendListItem: React.FC<{ friend: Friend }> = ({ friend }) => {
  const placeholderAvatar = `https://placehold.co/40x40/5c5f6a/ffffff?text=${friend.name.charAt(0)}`;

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors duration-200">
      <div className="flex items-center">
        <div className="relative">
          <img
            src={friend.avatarUrl}
            alt={friend.name}
            className="w-10 h-10 rounded-full"
            onError={(e) => {
              // Type assertion to inform TypeScript about the target element type
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = placeholderAvatar;
            }}
          />
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800"></span>
        </div>
        <div className="ml-3">
          <p className="text-white font-semibold">{friend.name}</p>
          <p className="text-gray-400 text-sm">Online</p>
        </div>
      </div>
      <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
        Message
      </button>
    </div>
  );
};

// --- MAIN FRIENDS COMPONENT ---
const Friends = () => {
  // --- STATE MANAGEMENT ---
  // State for the list of friends, initialized with mock data.
  const [onlineFriends, setOnlineFriends] = useState<Friend[]>([
    { name: 'Alex Carter', avatarUrl: 'https://i.pravatar.cc/40?u=a042581f4e29026704d' },
    { name: 'Priya N.', avatarUrl: 'https://i.pravatar.cc/40?u=a042581f4e29026705d' },
    { name: 'Diego Lima', avatarUrl: 'https://i.pravatar.cc/40?u=a042581f4e29026706d' },
  ]);
  // State for the username input field.
  const [username, setUsername] = useState('');

  // --- EVENT HANDLERS ---
  /**
   * Handles the logic for adding a new friend.
   */
  const handleAddFriend = () => {
    const trimmedUsername = username.trim();
    if (trimmedUsername) {
      // In a real app, you would make an API call here to send a friend request.
      console.log(`Sending friend request to: ${trimmedUsername}`);

      // Example: add friend to the list for demonstration purposes
      // setOnlineFriends(prevFriends => [...prevFriends, { name: trimmedUsername, avatarUrl: '' }]);

      setUsername(''); // Clear the input field
    } else {
      console.log('Username input is empty.');
    }
  };

  /**
   * Handles the 'Enter' key press in the input field to add a friend.
   */
  

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddFriend();
    }
  };

  // --- RENDER ---
  return (
    <div className="bg-gray-800 text-gray-200 p-6 rounded-2xl w-full max-w-sm font-sans">
      {/* Header section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Friends</h2>
        <button
          onClick={handleAddFriend}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <AddFriendIcon />
          Add Friend
        </button>
      </div>

      {/* Add Friend Input section */}
      <div className="mb-6">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter username#0000"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className="text-gray-400 text-xs mt-2">
          Send a friend request by {username}. People you add will appear below when they're online.
        </p>
      </div>

      {/* Online Friends List section */}
      <div>
        <h3 className="text-lg font-bold text-white mb-3">Online Friends</h3>
        <div className="space-y-2">
          {onlineFriends.map((friend) => (
            <FriendListItem key={friend.name} friend={friend} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Friends;
