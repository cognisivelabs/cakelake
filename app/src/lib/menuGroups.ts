import type { Category } from "@/types/catalog";
import { getCatalog, getCategories, getCategoriesByKind, readyBadge } from "@/lib/catalog";
import { categoriesRoute, ROUTES } from "@/lib/routes";
import { categoryPriceLabel } from "@/lib/pricing";

type MenuGroupEntry = { category: Category; priceLabel: string };
export type MenuGroup = { id: string; label: string; entries: MenuGroupEntry[] };

/**
 * The categories grouped by how soon they're ready — the layout of the
 * header's Cakes mega-menu and the mobile "All cakes" sheet. Built from
 * the catalog's own lead times, so a category whose notice changes moves
 * group without editing any menu.
 */
export function getMenuGroups(): MenuGroup[] {
  const catalog = getCatalog();
  const itemsIn = (category: Category) => catalog.filter((item) => item.categoryId === category.id);
  const entry = (category: Category): MenuGroupEntry => ({ category, priceLabel: categoryPriceLabel(itemsIn(category)) });
  const isSameDay = (category: Category) => itemsIn(category).every((item) => item.leadTimeHours === 0);

  const categories = getCategories();
  const standard = categories.filter((c) => c.kind !== "custom");
  const sameDay = standard.filter(isSameDay);
  const notice = standard.filter((c) => !isSameDay(c));
  const noticeHours = Math.max(0, ...notice.flatMap(itemsIn).map((item) => item.leadTimeHours));
  return [
    {
      id: "ready-1h",
      label: `CAKES · READY IN ${readyBadge({ leadTimeHours: 0 })}`,
      entries: sameDay.map(entry),
    },
    { id: "notice-24h", label: `CAKES ON ${readyBadge({ leadTimeHours: noticeHours })}`, entries: notice.map(entry) },
    {
      id: "custom",
      label: "PHOTO & CUSTOM",
      entries: getCategoriesByKind("custom").map(entry),
    },
  ].filter((group) => group.entries.length > 0);
}

/** Where the "Photo & Custom" links go: every custom category (Photo Cakes and
 * Custom Cakes) ticked together, or the whole menu if a build has none. */
export function getCustomCategoriesRoute(): string {
  const ids = getCategoriesByKind("custom").map((c) => c.id);
  return ids.length > 0 ? categoriesRoute(ids) : ROUTES.menu;
}
