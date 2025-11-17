import { fetchStandings } from "@/lib/fpl";
import { fetchPostsByTagName, fetchAllPosts } from "@/lib/sanity";
import LeagueStandings from "@/components/LeagueStandings";
import PostList from "@/components/PostList";

const LEAGUES = [
  { code: 668619, name: "PPL" },
  { code: 667900, name: "Segunda" },
  { code: 698097, name: "Vanarama" },
];

export default async function HomePage() {
  const [theckstonsThoughts, allNews, ...leagueStandings] = await Promise.all([
    fetchPostsByTagName("theckstons-thoughts"),
    fetchAllPosts(),
    ...LEAGUES.map((league) => fetchStandings(league.code)),
  ]);

  const leaguesData = LEAGUES.map((league, index) => ({
    name: league.name,
    standings: leagueStandings[index],
  }));

  return (
    <main className="container mx-auto min-h-screen max-w-6xl px-8 py-8">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900" style={{ fontFamily: "var(--font-oswald)" }}>League Standings</h2>
            <p className="text-gray-600">Track manager performance across all leagues</p>
          </div>
          <LeagueStandings leagues={leaguesData} />
        </div>

        {/* Sidebar */}
        <div className="mt-12 lg:mt-0 space-y-8">
          <PostList 
            title="Theckston's Thoughts" 
            description="Donny spills the tea"
            posts={theckstonsThoughts}
          />
          <PostList 
            title="All News" 
            posts={allNews}
          />
        </div>
      </div>
    </main>
  );
}