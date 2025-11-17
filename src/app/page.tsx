import Link from "next/link";
import { type SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";
import { fetchStandings } from "@/lib/fpl";
import LeagueStandings from "@/components/LeagueStandings";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

const options = { next: { revalidate: 30 } };

const LEAGUES = [
  { code: 668619, name: "PPL" },
  { code: 667900, name: "Segunda" },
  { code: 698097, name: "Vanarama" },
];

export default async function HomePage() {
  const [posts, ...leagueStandings] = await Promise.all([
    client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options),
    ...LEAGUES.map((league) => fetchStandings(league.code)),
  ]);

  const leaguesData = LEAGUES.map((league, index) => ({
    name: league.name,
    standings: leagueStandings[index],
  }));

  return (
    <main className="container mx-auto min-h-screen max-w-6xl px-8 py-8">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900" style={{ fontFamily: "var(--font-oswald)" }}>League Standings</h2>
        <p className="text-gray-600">Track manager performance across all leagues</p>
      </div>
      <LeagueStandings leagues={leaguesData} />

      <div className="mt-16">
        <h2 className="text-4xl font-bold mb-6 text-purple-600" style={{ fontFamily: "var(--font-oswald)" }}>Latest Posts</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              href={`/${post.slug.current}`}
              key={post._id}
              className="block p-6 rounded-lg bg-gray-50 border border-gray-200 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-100 transition-all duration-200 group"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-purple-600 transition-colors" style={{ fontFamily: "var(--font-oswald)" }}>
                {post.title}
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}