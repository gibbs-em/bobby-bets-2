"use client";

import { useState, Fragment } from "react";
import { type StandingResult } from "@/lib/fpl";

interface Zone {
  start: number;
  end: number;
  color: string;
  label: string;
}

interface LeagueData {
  name: string;
  standings: StandingResult[];
  zones: Zone[];
}

interface LeagueStandingsProps {
  leagues: LeagueData[];
}

export const getZoneForRank = (rank: number, totalTeams: number, zones: Zone[]) => {
  for (const zone of zones) {
    const startRank = zone.start > 0 ? zone.start : totalTeams + zone.start + 1;
    const endRank = zone.end > 0 ? zone.end : totalTeams + zone.end + 1;
    
    if (rank >= startRank && rank <= endRank) {
      return { ...zone, startRank, endRank };
    }
  }
  return null;
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
              <th className="text-left py-4 px-6 font-bold text-purple-600 uppercase text-sm tracking-wide" style={{ fontFamily: "var(--font-oswald)" }}>Score</th>
              <th className="text-left py-4 px-6 font-bold text-purple-600 uppercase text-sm tracking-wide" style={{ fontFamily: "var(--font-oswald)" }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {activeLeague.standings.map((standing, index) => {
              const totalTeams = activeLeague.standings.length;
              const currentZone = getZoneForRank(standing.rank, totalTeams, activeLeague.zones);
              const prevStanding = index > 0 ? activeLeague.standings[index - 1] : null;
              const prevZone = prevStanding ? getZoneForRank(prevStanding.rank, totalTeams, activeLeague.zones) : null;
              
              const isZoneStart = currentZone && (!prevZone || prevZone.label !== currentZone.label);
              const isZoneEnd = currentZone && (
                index === activeLeague.standings.length - 1 || 
                standing.rank === currentZone.endRank
              );
              
              const isRelegationZone = currentZone?.label.toLowerCase().includes('relegation');
              
              return (
                <Fragment key={standing.id}>
                  {isZoneStart && (
                    <tr>
                      <td colSpan={5} className={`py-2 px-6 text-xs uppercase tracking-wide font-bold ${
                        isRelegationZone ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {currentZone.label}
                      </td>
                    </tr>
                  )}
                  <tr
                    className={`border-b border-gray-200 transition-colors ${
                      currentZone ? currentZone.color : (index % 2 === 0 ? "bg-white" : "bg-gray-50")
                    } ${
                      isZoneStart 
                        ? isRelegationZone 
                          ? "border-t-2 border-dashed border-red-100" 
                          : "border-t-2 border-dashed border-green-100"
                        : ""
                    } ${
                      isZoneEnd 
                        ? isRelegationZone 
                          ? "border-b-2 border-dashed border-red-100" 
                          : "border-b-2 border-dashed border-green-100"
                        : ""
                    }`}
                  >
                    <td className="py-4 px-6 font-bold">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold bg-gray-200 text-gray-700">
                        {standing.rank}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-900">{standing.entry_name}</td>
                    <td className="py-4 px-6 text-gray-600">{standing.player_name}</td>
                    <td className="py-4 px-6 font-bold text-gray-900">{standing.points_for}</td>
                    <td className="py-4 px-6 font-bold text-gray-900">{standing.total}</td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

