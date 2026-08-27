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

const FPL_API = "https://fantasy.premierleague.com/api";

export interface FplBootstrapEvent {
  id: number;
  finished: boolean;
  is_current?: boolean;
}

interface BootstrapStaticResponse {
  events?: FplBootstrapEvent[];
}

/** Gameweek points for one entry in one event (from picks payload). */
export interface FplPicksResponse {
  entry_history?: {
    event: number;
    points: number;
  };
}

/** Next.js extended fetch cache options */
export type NextFetchCache = {
  revalidate?: number | false;
  tags?: string[];
};

export async function fetchFplBootstrap(
  nextOpts: NextFetchCache = { revalidate: 60 },
): Promise<BootstrapStaticResponse> {
  const response = await fetch(`${FPL_API}/bootstrap-static/`, {
    next: nextOpts,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch FPL bootstrap-static");
  }
  return response.json() as Promise<BootstrapStaticResponse>;
}

export function gameweekFinishedMap(
  events: FplBootstrapEvent[] | undefined,
): Map<number, boolean> {
  const map = new Map<number, boolean>();
  for (const e of events ?? []) {
    map.set(e.id, Boolean(e.finished));
  }
  return map;
}

export function getCurrentGameweekId(
  events: FplBootstrapEvent[] | undefined,
): number | null {
  const current = events?.find((e) => e.is_current);
  return current?.id ?? null;
}

export async function fetchEntryGameweekPoints(
  entryId: number,
  gameweek: number,
  nextOpts: NextFetchCache = { revalidate: 60 },
): Promise<number | null> {
  try {
    const response = await fetch(
      `${FPL_API}/entry/${entryId}/event/${gameweek}/picks/`,
      { next: nextOpts },
    );
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as FplPicksResponse;
    const pts = data.entry_history?.points;
    return typeof pts === "number" ? pts : null;
  } catch (error) {
    console.error("Error fetching FPL picks:", error);
    return null;
  }
}
