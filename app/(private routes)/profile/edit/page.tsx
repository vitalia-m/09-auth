"use client";

import Image from "next/image";
import css from "./EditProfilePage.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { editUser, type NewUserData, getMe } from "@/lib/api/clientApi";
import { useState } from "react";

type NewName = {
  username: string;
};

export default function EditProfile() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const avatarUrl = user?.avatar || "/avatar.webp";

  const handleCancel = () => router.back();

  const handleSubmit = async (formData: FormData) => {
    const { username } = Object.fromEntries(formData) as NewName;

    if (!username.trim()) {
      setError(true);
      setErrorMessage("Username cannot be empty.");
      return;
    }

    if (!user) return;

    try {
      setIsSubmitting(true);
      setError(false);
      setErrorMessage("");

      const newData: NewUserData = {
        email: user.email,
        username: username.trim(),
      };

      await editUser(newData);
      const updatedUser = await getMe();
      setUser(updatedUser);

      router.push("/profile");
    } catch (e) {
      setError(true);
      setErrorMessage((e as Error).message || "Something went wrong...");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <main className={css.mainContent}>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={avatarUrl}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} action={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={user.userName}
              className={css.input}
              disabled={isSubmitting}
              required
            />
          </div>

          <p>Email: {user.email}</p>

          {error && (
            <p className={css.error}>
              {errorMessage || "Something went wrong... please try again"}
            </p>
          )}

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={css.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
