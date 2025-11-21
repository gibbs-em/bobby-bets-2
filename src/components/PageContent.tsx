import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import AccordionBlock from "@/components/Accordion";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

interface PageContentProps {
  page: SanityDocument;
}

export default function PageContent({ page }: PageContentProps) {
  const pageImageUrl = page.image
    ? urlFor(page.image)?.width(1200).height(675).url()
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <article>
        {pageImageUrl && (
          <img
            src={pageImageUrl}
            alt={page.title}
            className="w-full aspect-video object-cover mb-8 rounded-lg"
            width="1200"
            height="675"
          />
        )}

        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900" style={{ fontFamily: "var(--font-oswald)" }}>
          {page.title}
        </h2>

        <div className="prose prose-gray prose-lg max-w-none">
          {Array.isArray(page.body) && (
            <PortableText 
              value={page.body} 
              components={{ 
                types: { 
                  accordionBlock: (props) => <AccordionBlock items={props.value.items} /> 
                },
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
      </article>
    </main>
  );
}