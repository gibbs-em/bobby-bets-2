import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";
import Author from "@/components/Author";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  ...,
  "author": author->{name, image}
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await client.fetch<SanityDocument>(POST_QUERY, await params, options);
  const postImageUrl = post.image
    ? urlFor(post.image)?.width(550).height(310).url()
    : null;
  
  const authorImageUrl = post.author?.image
    ? urlFor(post.author.image)?.width(48).height(48).url()
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <Link href="/blog" className="hover:underline text-purple-600 hover:text-green-600 transition-colors mb-6 inline-block">
        ← Back to Blog
      </Link>
      
      <article className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        {postImageUrl && (
          <img
            src={postImageUrl}
            alt={post.title}
            className="w-full aspect-video object-cover"
            width="550"
            height="310"
          />
        )}
        
        <div className="p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900" style={{ fontFamily: "var(--font-oswald)" }}>
            {post.title}
          </h1>
          
          <Author 
            publishedAt={post.publishedAt}
            author={post.author ? {
              name: post.author.name,
              imageUrl: authorImageUrl || undefined
            } : undefined}
          />
          
          <div className="prose prose-gray prose-lg max-w-none mt-8">
            {Array.isArray(post.body) && (
              <PortableText 
                value={post.body}
                components={{
                  block: {
                    normal: ({children}) => <p className="mb-4">{children}</p>,
                  },
                  marks: {
                    strong: ({children}) => <strong className="font-bold">{children}</strong>,
                    em: ({children}) => <em className="italic">{children}</em>,
                    code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{children}</code>,
                  },
                }}
              />
            )}
          </div>
        </div>
      </article>
    </main>
  );
}