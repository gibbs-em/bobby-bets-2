import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";

const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]`;
const POSTS_BY_TAG_QUERY = `*[
  _type == "post"
  && defined(slug.current)
  && count(tags[@->name == $tagName]) > 0
]|order(publishedAt desc)[0...3]{_id, title, slug, publishedAt}`;
const ALL_POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...3]{_id, title, slug, publishedAt}`;

const options = { next: { revalidate: 30 } };

export async function fetchPageBySlug(slug: string): Promise<SanityDocument | null> {
  return await client.fetch<SanityDocument | null>(PAGE_QUERY, { slug }, options);
}

export async function fetchPostsByTagName(tagName: string): Promise<SanityDocument[]> {
  return await client.fetch<SanityDocument[]>(POSTS_BY_TAG_QUERY, { tagName }, options);
}

export async function fetchAllPosts(): Promise<SanityDocument[]> {
  return await client.fetch<SanityDocument[]>(ALL_POSTS_QUERY, {}, options);
}

