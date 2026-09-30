"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Catalog } from "@/types/catalog";

const CatalogContext = createContext<Catalog | null>(null);

/** Makes the catalogue loaded by the root layout available to client components. */
export function CatalogProvider({ catalog, children }: { catalog: Catalog; children?: ReactNode }) {
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): Catalog {
  const catalog = useContext(CatalogContext);
  if (!catalog) throw new Error("useCatalog must be used within a CatalogProvider");
  return catalog;
}
