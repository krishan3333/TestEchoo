import React from 'react';
import Link from 'next/link';

// --- Helper Components & Functions ---
const CodeIcon = () => ( <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg> );
const DesignIcon = () => ( <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg> );
const GameIcon = () => ( <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12l2 2 4-4 4 4 2-2m-8 8a9 9 0 100-18 9 9 0 000 18z"></path></svg> );

// --- Data Logic (Now uses mock data for speed and reliability) ---
async function getContests(category: string) {
  if (category === "coding") {
    return [
      { id: "c-1", title: "Project Euler Monthly", status: "LIVE", theme: "Algorithms", url: "#"},
      { id: "c-2", title: "Weekly Hashing Challenge", status: "LIVE", theme: "Data Structures", url: "#"},
      { id: "c-3", title: "Next.js Code Jam", status: "UPCOMING", theme: "Web Dev", url: "#"},
    ];
  }
  if (category === "gaming") {
    return [{ id: "g-1", title: "Valorant Champions Tour", status: "LIVE", theme: "FPS", url: "#"}];
  }
  if (category === "design") {
    return [{ id: "d-1", title: "Weekly UI Challenge", status: "LIVE", theme: "UI/UX", url: "#"}];
  }
  return [];
}

// --- Main Page Component (Server Component) ---
export default async function ContestsPage({ searchParams }: { searchParams?: { category?: string } }) {
  const category = searchParams?.category || 'coding';
  const contests = await getContests(category);

  const iconForCategory = (cat: string) => {
    if (cat === "coding") return <CodeIcon />;
    if (cat === "gaming") return <GameIcon />;
    if (cat === "design") return <DesignIcon />;
    return <CodeIcon />;
  };

  return (
      <div className="text-white w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">Contests</h1>
          <div className="flex items-center gap-2">
            {["coding", "gaming", "design"].map((cat) => (
              <Link
                key={cat}
                href={`/dashboard/contests?category=${cat}`}
                className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors duration-200 ${
                  category === cat 
                    ? "bg-blue-600 text-white" 
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Link>
            ))}
          </div>
        </div>

        {/* Contest List Section */}
        <div className="space-y-3">
          {contests.length > 0 ? (
            contests.map((contest: any) => (
              <a 
                key={contest.id} 
                href={contest.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center bg-slate-800/50 hover:bg-slate-800 p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-700"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-slate-900/50 rounded-lg flex items-center justify-center mr-4">
                  {iconForCategory(category)}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-white truncate">{contest.title}</h3>
                  <p className="text-sm text-slate-400">{contest.theme}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full flex-shrink-0 ${
                  contest.status === "LIVE" 
                    ? "bg-red-500/20 text-red-300" 
                    : "bg-sky-500/20 text-sky-300"
                }`}>
                  {contest.status}
                </span>
              </a>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-800/50 rounded-xl text-slate-400">
                <p className="font-semibold">No Contests Found</p>
                <p className="text-sm mt-1">Try another category or check back later.</p>
            </div>
          )}
        </div>
      </div>
  );
}