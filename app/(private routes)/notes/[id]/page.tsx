import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";
import type { Metadata } from "next";

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}
export async function generateMetadata({
  params,
}: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  const noteTitle = note?.title ?? "Note details";
  const noteDescription =
    note?.content ?? "Read the full details of this note on NoteHub.";

  return {
    title: `NoteHub - ${noteTitle}`,
    description: `${noteDescription}`,
    openGraph: {
      type: "article",
      url: `https://09-auth-phi.vercel.app/notes/${id}`,
      title: `NoteHub - ${noteTitle}`,
      description: noteDescription,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          alt: "NoteHub preview image",
        },
      ],
    },
  };
}

export default async function NoteDetails({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["Note", parseInt(id)],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
