import type { Catalog, CatalogItem, Category, FlavourTag, Occasion } from "@/types/catalog";
import { CATEGORIES } from "@/data/categories";
import { ITEMS } from "@/data/items";
import { FLAVOUR_TAGS, OCCASIONS } from "@/data/taxonomy";
import { itemMatchesFilters, type MenuFilters } from "@/lib/search";

// The internal catalogue API: each function stands in for one backend
// endpoint and is the only code that reads the catalogue's data files.

export async function fetchCategories(): Promise<Category[]> {
  return CATEGORIES;
}

export async function fetchItems(): Promise<CatalogItem[]> {
  return ITEMS;
}

/** One item by its slug; undefined when there's no such item. */
export async function fetchItem(slug: string): Promise<CatalogItem | undefined> {
  return ITEMS.find((item) => item.slug === slug);
}

export async function fetchOccasions(): Promise<Occasion[]> {
  return OCCASIONS;
}

export async function fetchFlavourTags(): Promise<FlavourTag[]> {
  return FLAVOUR_TAGS;
}

/** Categories, items, occasions and flavour tags together. */
export async function fetchCatalog(): Promise<Catalog> {
  const [categories, items, occasions, flavourTags] = await Promise.all([
    fetchCategories(),
    fetchItems(),
    fetchOccasions(),
    fetchFlavourTags(),
  ]);
  return { categories, items, occasions, flavourTags };
}

/** The items matching a menu search: its text plus category, price,
 * flavour and occasion filters, in menu order. */
export async function searchItems(filters: MenuFilters): Promise<CatalogItem[]> {
  const catalog = await fetchCatalog();
  return catalog.items.filter((item) => itemMatchesFilters(catalog, item, filters));
}
