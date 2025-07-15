"use client";
import { fetchNoteById } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./NotesPage.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Note } from "@/types/note";
import Link from "next/link";

interface NotesClientProps {
  initialResponse: {
    notes: Note[];
    totalPages: number;
  };
  tag: string | undefined;
}

export default function NotesClient({
  initialResponse,
  tag,
}: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce<string>(query, 1000);

  const loadNotes = useQuery({
    queryKey: ["Notes", debouncedQuery, currentPage, tag],
    queryFn: () => fetchNoteById(debouncedQuery, currentPage, tag),
    initialData: initialResponse,
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setQuery(query);
    setCurrentPage(1);
  };

  if (loadNotes.isError) {
    throw new Error();
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={onChangeQuery} value={query} />
        {loadNotes.isSuccess && loadNotes.data.totalPages > 1 && (
          <Pagination
            pageCount={loadNotes.data.totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {loadNotes.isSuccess && <NoteList notes={loadNotes.data.notes} />}
    </div>
  );
}
