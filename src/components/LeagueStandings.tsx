"use client";

import { useState } from "react";
import { type StandingResult } from "@/lib/fpl";

interface LeagueData {
  name: string;
  standings: StandingResult[];
}

interface LeagueStandingsProps {
  leagues: LeagueData[];
}

export default function LeagueStandings({ leagues }: LeagueStandingsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const activeLeague = leagues[activeTab];

  if (!activeLeague || activeLeague.standings.length === 0) {
    return (
      <div className="mb-12 p-6 rounded-lg bg-gray-50 border border-gray-200">
        <p className="text-gray-600">
          Unable to load standings at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {leagues.map((league, index) => (
          <button
            key={league.name}
            onClick={() => setActiveTab(index)}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wide transition-all duration-200 relative ${
              activeTab === index
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            {league.name}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 font-bold text-purple-600 uppercase text-sm tracking-wide" style={{ fontFamily: "var(--font-oswald)" }}>Rank</th>
              <th className="text-left py-4 px-6 font-bold text-purple-600 uppercase text-sm tracking-wide" style={{ fontFamily: "var(--font-oswald)" }}>Team</th>
              <th className="text-left py-4 px-6 font-bold text-purple-600 uppercase text-sm tracking-wide" style={{ fontFamily: "var(--font-oswald)" }}>Manager</th>
            </tr>
          </thead>
          <tbody>
            {activeLeague.standings.map((standing, index) => (
              <tr
                key={standing.id}
                className={`border-b border-gray-200 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-purple-50`}
              >
                <td className="py-4 px-6 font-bold">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                    standing.rank === 1
                      ? "bg-linear-to-br from-yellow-400 to-yellow-500 text-gray-900"
                      : standing.rank === 2
                      ? "bg-gray-300 text-gray-900"
                      : standing.rank === 3
                      ? "bg-amber-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {standing.rank}
                  </span>
                </td>
                <td className="py-4 px-6 font-semibold text-gray-900">{standing.entry_name}</td>
                <td className="py-4 px-6 text-gray-600">{standing.player_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

