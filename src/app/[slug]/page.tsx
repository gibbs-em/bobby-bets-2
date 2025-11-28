import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";
import Author from "@/components/Author";
import { Metadata } from "next";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractTextFromBlocks(blocks: any[]): string {
  if (!Array.isArray(blocks)) return "";
  
  return blocks
    .map((block) => {
      if (block._type === "block" && block.children) {
        return block.children
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((child: any) => (typeof child === "string" ? child : child.text || ""))
          .join("");
      }
      return "";
    })
    .join(" ")
    .trim();
}

const siteUrl = process.env.SITE_URL || "https://bobbybets.org";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch<SanityDocument>(POST_QUERY, { slug }, options);
  
  if (!post) {
    return {
      title: "Post Not Found - Bobby Bets",
    };
  }

  const postUrl = `${siteUrl}/${slug}`;
  
  // Generate description from excerpt or body
  let description = post.excerpt || "";
  if (!description && Array.isArray(post.body)) {
    const bodyText = extractTextFromBlocks(post.body);
    description = bodyText.substring(0, 160).trim();
    if (bodyText.length > 160) {
      description += "...";
    }
  }
  if (!description) {
    description = `Read ${post.title} on Bobby Bets`;
  }

  // Generate OG image URL (1200x630 is the recommended OG image size)
  const ogImageUrl = post.image
    ? urlFor(post.image)?.width(1200).height(630).url() || null
    : null;

  const metadata: Metadata = {
    title: `${post.title} - Bobby Bets`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: postUrl,
      publishedTime: post.publishedAt,
      ...(ogImageUrl
        ? {
            images: [
              {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ],
          }
        : {}),
      ...(post.author?.name && {
        authors: [post.author.name],
      }),
    },
  };

  return metadata;
}

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