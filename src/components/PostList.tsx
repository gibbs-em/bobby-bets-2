import Link from "next/link";
import { type SanityDocument } from "next-sanity";

interface PostListProps {
  title: string;
  description?: string;
  posts: SanityDocument[];
  className?: string;
}

export default function PostList({ title, description, posts, className = "" }: PostListProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex"> 
      <h3 className="text-2xl font-bold mb-1 text-purple-600" style={{ fontFamily: "var(--font-oswald)" }}>
        {title}
      </h3>
      </div>
      <p className="mb-2 italic text-gray-600">{description}</p>
      <div className="space-y-3">
        {posts.map((post) => (
          <Link
            href={`/${post.slug.current}`}
            key={post._id}
            className="block p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-100 transition-all duration-200 group"
          >
            <h4 className="text-lg font-semibold mb-1 text-gray-900 group-hover:text-purple-600 transition-colors" style={{ fontFamily: "var(--font-oswald)" }}>
              {post.title}
            </h4>
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
  );
}

