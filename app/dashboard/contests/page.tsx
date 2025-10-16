"use client";
import React, { useEffect, useState } from "react";

// ICONS (as before)
const ViewAllIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
  </svg>
);
const CodeIcon = () => (
  <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
  </svg>
);
const DesignIcon = () => (
  <svg className="w-6 h-6 mr-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path>
  </svg>
);
const GameIcon = () => (
  <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M6 12l2 2 4-4 4 4 2-2m-8 8a9 9 0 100-18 9 9 0 000 18z"></path>
  </svg>
);

// Sorting: live first
function sortContests(list: any[]) {
  return list.sort((a, b) => {
    if (a.status === b.status) return 0;
    if (a.status === "live") return -1;
    return 1;
  });
}

export default function Contests() {
  const [branch, setBranch] = useState<string>("");
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!branch) {
      setContests([]);
      return;
    }
    setLoading(true);
    fetch(`/api/contests?category=${branch}`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.contests || [];
        setContests(sortContests(list));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch contests:", err);
        setLoading(false);
      });
  }, [branch]);

  const iconForCategory = (cat: string) => {
    if (cat === "coding") return <CodeIcon />;
    if (cat === "gaming") return <GameIcon />;
    if (cat === "design") return <DesignIcon />;
    return <CodeIcon />;
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-2xl shadow-2xl text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Live & Upcoming Contests</h2>
          <button className="flex items-center bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg text-sm">
            <ViewAllIcon /> View All
          </button>
        </div>

        {/* Category Buttons */}
        <div className="flex gap-4 mb-6 justify-center">
          {["coding", "gaming", "design"].map((cat) => (
            <button
              key={cat}
              onClick={() => setBranch(cat)}
              className={`px-5 py-2 rounded-full font-semibold tracking-wide transition-all ${
                branch === cat
                  ? "bg-blue-600 hover:bg-blue-700 scale-105"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400 text-center mt-8">Loading {branch} contests...</p>
        ) : !branch ? (
          <p className="text-gray-400 text-center mt-8">Pick a category above to view contests</p>
        ) : contests.length === 0 ? (
          <p className="text-gray-400 text-center mt-8">No contests found in {branch}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {contests.map((contest) => (
              <div
                key={contest.id}
                onClick={() => window.open(contest.url, "_blank")}
                className="bg-gray-700 hover:bg-gray-600 p-4 flex items-start gap-3 rounded-xl transition-transform transform hover:scale-[1.02] cursor-pointer"
              >
                {iconForCategory(branch)}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{contest.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        contest.status === "live" ? "bg-red-500" : "bg-gray-500"
                      }`}
                    >
                      {contest.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {contest.status === "live"
                      ? `Ends in ${contest.timeLeft}`
                      : `Starts in ${contest.startsIn}`}
                  </p>
                  <p className="text-sm text-gray-300 mt-2">Theme: {contest.theme}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
