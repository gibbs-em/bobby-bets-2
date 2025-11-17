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
      <div className="mb-12 p-6 rounded-lg bg-[#1a2e1f] border border-[#374151]">
        <p className="text-[#9ca3af]">
          Unable to load standings at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex gap-2 mb-6 border-b border-[#374151]">
        {leagues.map((league, index) => (
          <button
            key={league.name}
            onClick={() => setActiveTab(index)}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wide transition-all duration-200 relative ${
              activeTab === index
                ? "text-[#10b981] border-b-2 border-[#10b981]"
                : "text-[#9ca3af] hover:text-[#f0fdf4]"
            }`}
          >
            {league.name}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#374151] bg-[#1a2e1f]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#374151] bg-[#0d2818]">
              <th className="text-left py-4 px-6 font-bold text-[#10b981] uppercase text-sm tracking-wide">Rank</th>
              <th className="text-left py-4 px-6 font-bold text-[#10b981] uppercase text-sm tracking-wide">Team</th>
              <th className="text-left py-4 px-6 font-bold text-[#10b981] uppercase text-sm tracking-wide">Manager</th>
            </tr>
          </thead>
          <tbody>
            {activeLeague.standings.map((standing, index) => (
              <tr
                key={standing.id}
                className={`border-b border-[#374151] transition-colors ${
                  index % 2 === 0 ? "bg-[#1a2e1f]" : "bg-[#0d2818]"
                } hover:bg-[#1f3a2a] hover:border-[#10b981]/50`}
              >
                <td className="py-4 px-6 font-bold">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                    standing.rank === 1
                      ? "bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-[#0d2818]"
                      : standing.rank === 2
                      ? "bg-[#9ca3af] text-[#0d2818]"
                      : standing.rank === 3
                      ? "bg-[#92400e] text-[#f0fdf4]"
                      : "bg-[#374151] text-[#f0fdf4]"
                  }`}>
                    {standing.rank}
                  </span>
                </td>
                <td className="py-4 px-6 font-semibold">{standing.entry_name}</td>
                <td className="py-4 px-6 text-[#9ca3af]">{standing.player_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

