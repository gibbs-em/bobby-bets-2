import Image from "next/image";

interface AuthorData {
  name: string;
  imageUrl?: string;
}

interface AuthorProps {
  author?: AuthorData;
  publishedAt: string;
}

export default function Author({ 
  author,
  publishedAt
}: AuthorProps) {
  const name = author?.name || "BobbyBets Team";
  const avatarUrl = author?.imageUrl || "/logo_BG.png";
  
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200">
      <Image 
        src={avatarUrl} 
        alt={name}
        width={48}
        height={48}
        className="rounded-full"
      />
      <div>
        <p className="font-semibold text-gray-900">{name}</p>
        <time className="text-sm text-gray-600" dateTime={publishedAt}>
          {formattedDate}
        </time>
      </div>
    </div>
  );
}

