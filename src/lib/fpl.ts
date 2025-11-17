export interface StandingResult {
  id: number;
  division: number;
  entry: number;
  player_name: string;
  rank: number;
  last_rank: number;
  rank_sort: number;
  total: number;
  entry_name: string;
  matches_played: number;
  matches_won: number;
  matches_drawn: number;
  matches_lost: number;
  points_for: number;
}

interface StandingsResponse {
  standings: {
    results: StandingResult[];
  };
}

const options = { next: { revalidate: 30 } };

export async function fetchStandings(
  leagueCode: number
): Promise<StandingResult[]> {
  try {
    const response = await fetch(
      `https://fantasy.premierleague.com/api/leagues-h2h/${leagueCode}/standings/`,
      options
    );
    if (!response.ok) {
      throw new Error("Failed to fetch standings");
    }
    const data: StandingsResponse = await response.json();
    return data.standings.results;
  } catch (error) {
    console.error("Error fetching standings:", error);
    return [];
  }
}

