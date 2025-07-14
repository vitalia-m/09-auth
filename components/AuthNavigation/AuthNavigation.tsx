"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import css from "./AuthNavigation.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import { logout } from "@/lib/api/clientApi";

export default function AuthNavigation() {
  const router = useRouter();

  const { isAuthenticated, user } = useAuthStore();
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      clearIsAuthenticated();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occupied. Try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              className={css.navigationLink}
              prefetch={false}
            >
              Profile
            </Link>
          </li>
          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email}</p>
            <button
              className={css.logoutButton}
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logout…" : "Logout"}
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              className={css.navigationLink}
              prefetch={false}
            >
              Login
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              className={css.navigationLink}
              prefetch={false}
            >
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  );
}
