import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug[0] ?? "All";

  const title = `NoteHub - Filter: ${filter}`;
  const description = `Viewing notes filtered by "${filter}" in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://09-auth-phi.vercel.app/${filter}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          alt: "NoteHub OG Image",
        },
      ],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;
  const tag = slug[0] === "All" ? undefined : slug[0];
  const response = await fetchNotes("", 1, tag);

  return <NotesClient initialResponse={response} tag={tag} />;
}
