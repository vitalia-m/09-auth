"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { register, RegisterRequest, getMe } from "@/lib/api/clientApi";
import css from "./SignUpPage.module.css";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      const regData: RegisterRequest = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      const res = await register(regData);
      const user = await getMe();

      if (res.email) {
        setUser(user);
        router.push("/profile");
      } else if ("message" in res) {
        setError(res.message);
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <main className={css.mainContent}>
      <form
        className={css.form}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleSubmit(formData);
        }}
      >
        <h1 className={css.formTitle}>Sign up</h1>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
