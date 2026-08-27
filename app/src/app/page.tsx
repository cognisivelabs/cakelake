import Link from "next/link";
import { CONFIG } from "@/lib/config";

export default function HomePage() {
  return (
    <div>
      <h1>Cake Lake Bakery</h1>
      <p>
        Browse our menu, build your order, and send it to us on WhatsApp —
        no online payment, pay at the store or on delivery.
      </p>
      <p>
        <Link href="/menu">Browse Menu →</Link>
      </p>
      <p>
        <a
          href={`https://wa.me/${CONFIG.bakeryWhatsAppNumber}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Message us on WhatsApp
        </a>
      </p>
    </div>
  );
}
