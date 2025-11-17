import { fetchPageBySlug } from "@/lib/sanity";
import PageContent from "@/components/PageContent";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Hall of Record - Bobby Bets",
  description: "Hall of Record for Bobby Bets",
};

export default async function RecordsPage() {
  const page = await fetchPageBySlug("records");

  if (!page) {
    notFound();
  }

  return <PageContent page={page} />;
}

