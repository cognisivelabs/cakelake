import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalog, getItemById } from "@/lib/catalog";
import { withBasePath } from "@/lib/assets";
import { SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/og";
import { ItemDetailView } from "@/components/ItemDetailView";

export function generateStaticParams() {
  return getCatalog().map((item) => ({ itemId: item.id }));
}

type ItemPageProps = { params: Promise<{ itemId: string }> };

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { itemId } = await params;
  const item = getItemById(itemId);
  if (!item) return {};

  const photo = item.flavours.find((f) => f.imageUrl)?.imageUrl;

  return {
    title: item.name,
    description: item.description,
    // See lib/og.ts: Next doesn't deep-merge a page's openGraph with the
    // parent layout's, so siteName/type/url/images are all repeated here
    // rather than assumed inherited — only title/description get
    // backfilled from this same object's fields above when omitted.
    openGraph: {
      siteName: SITE_NAME,
      type: "website",
      url: withBasePath(`/menu/${item.id}/`),
      images: [photo ? { url: withBasePath(photo), alt: item.name } : DEFAULT_OG_IMAGE],
    },
  };
}

export default async function ItemDetailPage({ params }: ItemPageProps) {
  const { itemId } = await params;
  const item = getItemById(itemId);
  if (!item) notFound();

  return <ItemDetailView item={item} />;
}
