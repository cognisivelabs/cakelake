"use client";

import { useEffect, useEffectEvent } from "react";
import { useSearchParams } from "next/navigation";

export type MenuUrlParams = {
  q: string;
  flavour: string;
  occasion: string;
  price: string;
  category: string;
};

/**
 * Reports the menu's URL search params to the page whenever they change,
 * including Next.js soft navigations (a header/mega-menu link clicked
 * while already on /menu) that no window event announces. Kept as its
 * own tiny component so useSearchParams' required Suspense boundary
 * wraps only this — the rest of the menu still prerenders.
 */
export function UrlParamsSync({ onParams }: { onParams: (params: MenuUrlParams) => void }) {
  const searchParams = useSearchParams();
  const report = useEffectEvent(() =>
    onParams({
      q: searchParams.get("q") ?? "",
      flavour: searchParams.get("flavour") ?? "",
      occasion: searchParams.get("occasion") ?? "",
      price: searchParams.get("price") ?? "",
      category: searchParams.get("category") ?? "",
    }),
  );

  // Re-report per the params' actual contents, not the object's identity.
  const key = searchParams.toString();
  useEffect(() => report(), [key]);

  return null;
}
