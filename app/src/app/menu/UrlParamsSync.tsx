"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export type MenuUrlParams = {
  q: string;
  flavour: string;
  occasion: string;
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
  const onParamsRef = useRef(onParams);
  useEffect(() => {
    onParamsRef.current = onParams;
  });

  const key = searchParams.toString();
  useEffect(() => {
    onParamsRef.current({
      q: searchParams.get("q") ?? "",
      flavour: searchParams.get("flavour") ?? "",
      occasion: searchParams.get("occasion") ?? "",
      category: searchParams.get("category") ?? "",
    });
    // key is searchParams' contents — re-run per its actual changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}
