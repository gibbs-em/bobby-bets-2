import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc){_id, title, slug, publishedAt, excerpt}`;

const options = { next: { revalidate: 30 } };

export const metadata = {
  title: "Blog - Bobby Bets",
  description: "All the latest news, updates, and analysis from Bobby Bets",
};

export default async function BlogPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <main className="container mx-auto min-h-screen max-w-6xl px-8 py-8">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900" style={{ fontFamily: "var(--font-oswald)" }}>Blog</h1>
        <p className="text-gray-600">
          All the latest news, updates, and analysis from your highly legitimate source
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            href={`/${post.slug.current}`}
            key={post._id}
            className="block p-6 rounded-lg bg-gray-50 border border-gray-200 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-100 transition-all duration-200 group"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-purple-600 transition-colors" style={{ fontFamily: "var(--font-oswald)" }}>
              {post.title}
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {post.excerpt && (
              <p className="text-sm text-gray-700 line-clamp-3">{post.excerpt}</p>
            )}
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No posts yet. Check back soon!</p>
        </div>
      )}
    </main>
  );
}

