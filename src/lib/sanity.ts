import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";

const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]`;

const options = { next: { revalidate: 30 } };

export async function fetchPageBySlug(slug: string): Promise<SanityDocument | null> {
  return await client.fetch<SanityDocument | null>(PAGE_QUERY, { slug }, options);
}

