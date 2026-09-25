"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/Icons";
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
      <SearchIcon />
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
