import Image from "next/image";
import css from "./ProfilePage.module.css";
import Link from "next/link";
import { type Metadata } from "next";
import { getMe } from "@/lib/api/serverApi";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getMe();

  return {
    title: `NoteHub - ${user.userName}`,
    description:
      "Start capturing your thoughts with NoteHub. This page lets you quickly create and organize a new note.",
    icons: {
      icon: "/favicon.svg",
    },

    openGraph: {
      title: `NoteHub - ${user.userName}`,
      description:
        "Quickly add a new note and keep your ideas organized in NotesHub.",
      url: "https://09-auth-phi.vercel.app",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
      siteName: "NoteHub",
      type: "article",
    },
  };
}

export default async function Profile() {
  const user = await getMe();
  const avatarUrl = user?.avatar ?? "/default-avatar.png";
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={avatarUrl}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user?.userName}</p>
          <p>Email: {user?.email}</p>
        </div>
      </div>
    </main>
  );
}
