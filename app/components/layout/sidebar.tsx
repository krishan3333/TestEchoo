'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Server, Bot, Trophy, Cog } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

// Define User type
interface User {
  username: string;
  imageUrl: string | null;
}

// Reusable navigation item component
const NavItem = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) => {
  const pathname = usePathname();
  
  // *** FIX APPLIED HERE ***
  // For the Home link, we need an exact match.
  // For all other links, we check if the current path starts with the link's href.
  const isActive = (href === "/dashboard") 
    ? pathname === href 
    : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
        ${
          isActive
            ? 'bg-gradient-to-r from-cyan-500/80 to-blue-600/80 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]'
            : 'text-gray-400 hover:text-white hover:bg-slate-800/60 hover:shadow-[0_0_10px_rgba(56,189,248,0.2)]'
        }
      `}
    >
      <Icon
        size={20}
        className={`transition-transform duration-300 ${
          isActive ? 'text-white' : 'group-hover:text-cyan-400'
        }`}
      />
      <span>{label}</span>
    </Link>
  );
};

export default function Sidebar({ user }: { user: User }) {
  return (
    <aside
      className="w-72 h-screen flex flex-col p-5 text-white
                 bg-slate-950/70 backdrop-blur-md border-r border-cyan-500/20
                 shadow-[0_0_25px_rgba(56,189,248,0.2)]"
    >
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-8 border-b border-cyan-500/20 pb-4">
        <div className="relative">
          <UserButton afterSignOutUrl="/" />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border border-slate-900" />
        </div>
        <div className="flex flex-col flex-grow">
          <p className="font-semibold text-white text-sm">{user.username}</p>
          <p className="text-xs text-gray-400">@{user.username.toLowerCase().replace(/\s+/g, '')}</p>
        </div>
        <Cog
          size={20}
          className="text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">
        <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider px-2 mb-1">
          Navigation
        </h3>

        <NavItem href="/dashboard" icon={Home} label="Home" />
        <NavItem href="/dashboard/friends" icon={Users} label="Friends" />
        <NavItem href="/servers" icon={Server} label="Servers" />
        <NavItem href="/dashboard/contests" icon={Trophy} label="Contests" />
        <NavItem href="/dashboard/AI" icon={Bot} label="AI Chat" />

        {/* AI Chat Link with Glow Effect */}
        <div className="relative mt-2">
          <div className="absolute inset-0 blur-md rounded-xl" />
        </div>
      </nav>

      {/* Footer / Branding */}
      <div className="mt-auto pt-6 border-t border-cyan-500/20 text-center">
        <p className="text-xs text-gray-500 tracking-wide">
          <span className="text-cyan-400">Echoo</span> © 2025
        </p>
      </div>
    </aside>
  );
}