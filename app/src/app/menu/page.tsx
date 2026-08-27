import { getCatalog, getCategories } from "@/lib/catalog";
import { ItemCard } from "@/components/ItemCard";

export default function MenuPage() {
  const catalog = getCatalog();
  const categories = getCategories();

  return (
    <div>
      <h1>Menu</h1>
      <p>Placeholder items — real menu content is still pending.</p>
      {categories.map((category) => (
        <section key={category} style={{ marginTop: 32 }}>
          <h2>{category}</h2>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              marginTop: 12,
            }}
          >
            {catalog
              .filter((item) => item.category === category)
              .map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
