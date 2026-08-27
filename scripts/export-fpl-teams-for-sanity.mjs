#!/usr/bin/env node
/**
 * Export FPL H2H league members as Sanity `team` documents (NDJSON).
 *
 * League codes must match src/app/page.tsx → LEAGUES (order = division1..3).
 *
 * Usage (from nextjs-bobby-bets):
 *   npm run export-teams
 *     → writes teams.ndjson (no shell redirect; avoids npm banner junk)
 *   node scripts/export-fpl-teams-for-sanity.mjs path/to/out.ndjson
 *   node scripts/export-fpl-teams-for-sanity.mjs   # NDJSON to stdout only
 *
 * Import into Sanity (from studio-bobby-bets, logged in):
 *   npx sanity dataset import ../nextjs-bobby-bets/teams.ndjson production --replace
 *
 * Re-run safe: stable _id per FPL entry (`team-fpl-<entryId>`). Use
 *   --replace to overwrite existing docs with the same _id.
 */

import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const FPL_API = "https://fantasy.premierleague.com/api";

/** @type {{ code: number, division: 'division1' | 'division2' | 'division3', label: string }[]} */
const LEAGUES = [
  { code: 694268, division: "division1", label: "PPL" },
  { code: 744202, division: "division2", label: "Segunda" },
  { code: 805765, division: "division3", label: "Vanarama" },
];

function slugifyTeamName(name, entryId) {
  const base = String(name || "team")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const safe = base.length ? base : "team";
  return `${safe}-${entryId}`;
}

async function fetchStandings(leagueCode) {
  const res = await fetch(
    `${FPL_API}/leagues-h2h/${leagueCode}/standings/`,
  );
  if (!res.ok) {
    throw new Error(`FPL standings ${leagueCode}: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data?.standings?.results ?? [];
}

function toTeamDoc(row, division) {
  const entryId = row.entry;
  const name = row.entry_name?.trim() || `Entry ${entryId}`;
  const managerName = row.player_name?.trim() || "Unknown";

  return {
    _id: `team-fpl-${entryId}`,
    _type: "team",
    name,
    managerName,
    fplEntryId: entryId,
    division,
    slug: {
      _type: "slug",
      current: slugifyTeamName(name, entryId),
    },
  };
}

async function main() {
  const outArg = process.argv[2];
  const lines = [];

  for (const league of LEAGUES) {
    const results = await fetchStandings(league.code);
    for (const row of results) {
      lines.push(JSON.stringify(toTeamDoc(row, league.division)));
    }
  }

  const body = lines.join("\n") + (lines.length ? "\n" : "");

  if (outArg) {
    const filePath = resolve(process.cwd(), outArg);
    await writeFile(filePath, body, "utf8");
    console.error(
      `Wrote ${lines.length} team document(s) to ${filePath} (${LEAGUES.map((l) => l.label).join(", ")}).`,
    );
  } else {
    process.stdout.write(body);
    console.error(
      `Wrote ${lines.length} team document(s) to stdout (NDJSON). Divisions: ${LEAGUES.map((l) => l.label).join(", ")}.`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
