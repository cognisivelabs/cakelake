"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { searchRoute } from "@/lib/routes";
import styles from "./HeaderSearch.module.css";

// The header's "Search cakes and flavours…" field — searching hands off
// to the menu, which applies it as its own search (?q=).
export function HeaderSearch({
  variant,
  onSubmitted,
}: {
  variant: "desktop" | "mobile";
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <form
      role="search"
      className={`${styles.field} ${variant === "mobile" ? styles.mobile : styles.desktop}`}
      onSubmit={(e) => {
        e.preventDefault();
        const text = query.trim();
        if (!text) return;
        router.push(searchRoute(text));
        onSubmitted?.();
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M16.5 16.5 21 21" />
      </svg>
      <input
        type="text"
        className={`${styles.input} no-focus-ring`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search cakes and flavours…"
        aria-label="Search cakes and flavours"
        enterKeyHint="search"
      />
    </form>
  );
}
