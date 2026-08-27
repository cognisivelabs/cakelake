import { notFound } from "next/navigation";
import { getCatalog, getItemById } from "@/lib/catalog";
import { ItemDetailView } from "@/components/ItemDetailView";

export function generateStaticParams() {
  return getCatalog().map((item) => ({ itemId: item.id }));
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  const item = getItemById(itemId);
  if (!item) notFound();

  return <ItemDetailView item={item} />;
}
