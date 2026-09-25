import Link from "next/link";
import { CONFIG } from "@/lib/config";
import { Photo } from "@/components/Photo";
import {
  categoryShortLabel,
  getCatalog,
  getCategories,
  getCategory,
  getFlavourTagImage,
  getFlavourTags,
  getCategoryImage,
  getMostOrdered,
  getOccasions,
} from "@/lib/catalog";
import { cheapestPrice, formatAed } from "@/lib/pricing";
import { categoryRoute, flavourRoute, itemRoute, occasionRoute } from "@/lib/routes";
import { getCustomCategoriesRoute } from "@/lib/menuGroups";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import { HOME_BANNERS } from "@/data/banners";
import { HeroBanners } from "./HeroBanners";
import { MostOrdered, type MostOrderedCard } from "./MostOrdered";
import { RailSection } from "./RailSection";
import styles from "./HomeSections.module.css";

export function HomeHero() {
  return (
    <div className={styles.hero}>
      <HeroBanners banners={HOME_BANNERS} />
      <div className={styles.sideCards}>
        <Link href={getCustomCategoriesRoute()} className={`${styles.sideCard} ${styles.sideCardWhite}`}>
          <span className={`${styles.sideBadge} mono-tag`}>24 HOURS</span>
          <div className={styles.sideTitle}>Photo &amp; 3D cakes</div>
          <div className={styles.sideText}>
            Send us the photo or the idea; we build it and confirm the price in chat.
          </div>
          <div className={`${styles.sideLink} ${styles.sideLinkBerry}`}>Start a custom order →</div>
        </Link>
        <a
          href={buildWhatsAppUrl()}
          {...EXTERNAL_LINK_PROPS}
          className={`${styles.sideCard} ${styles.sideCardWarm}`}
        >
          <div className={styles.sideTitle}>Counter-only treats</div>
          <div className={styles.sideText}>
            Cupcakes, cookies and pastries aren&apos;t online — ask us on WhatsApp and we&apos;ll set them
            aside.
          </div>
          <div className={`${styles.sideLink} ${styles.sideLinkTeal}`}>Message the shop →</div>
        </a>
      </div>
    </div>
  );
}

const TRUST_ITEMS = [
  { title: "Eggless, pure veg", sub: "Every cake, no exceptions" },
  { title: "Live bakery", sub: "Baked to order in Karama" },
  { title: "Ready in 1 hour", sub: "On the four cake ranges" },
  { title: "Nothing charged online", sub: "Pay at the shop or by bank transfer" },
];

export function TrustStrip() {
  return (
    <div className={styles.trust}>
      {TRUST_ITEMS.map((item) => (
        <div key={item.title} className={styles.trustItem}>
          <div className={styles.trustTitle}>{item.title}</div>
          <div className={styles.trustSub}>{item.sub}</div>
        </div>
      ))}
    </div>
  );
}

export function CategoryTiles() {
  const categories = getCategories();
  const minPrice = cheapestPrice(getCatalog());
  return (
    <RailSection
      title="Shop by category"
      meta={`${categories.length} categories${minPrice !== undefined ? ` · flavour prices from ${formatAed(minPrice)}` : ""}`}
      mobileMeta={`${categories.length} · swipe →`}
    >
      {categories.map((category) => {
        const image = getCategoryImage(category.id);
        // A custom category with no photo of its own (3D cakes) gets the
        // outlined "24 HRS" tile instead of an empty placeholder.
        const custom = category.kind === "custom" && !image;
        return (
          <Link key={category.id} href={categoryRoute(category.id)} className={styles.tile}>
            <div className={`${styles.tileImage} ${custom ? styles.tileImageCustom : ""}`}>
              <Photo src={image} />
              {custom && <span className={`${styles.tileNote} mono-tag`}>24 HRS</span>}
            </div>
            <div className={styles.tileLabel}>{categoryShortLabel(category)}</div>
          </Link>
        );
      })}
    </RailSection>
  );
}

export function OccasionTiles() {
  return (
    <RailSection
      title="Shop by occasion"
      meta="Same cakes, with the message and decoration to suit"
      mobileMeta="Swipe →"
      arrows={false}
    >
      {getOccasions().map((occasion) => (
        <Link key={occasion.id} href={occasionRoute(occasion.id)} className={styles.occasion}>
          <div className={styles.occasionPhoto}>
            <Photo src={occasion.imageUrl} />
          </div>
          <div className={styles.occasionName}>{occasion.label}</div>
        </Link>
      ))}
    </RailSection>
  );
}

export function MostOrderedSection() {
  const items = getMostOrdered();
  const cards: MostOrderedCard[] = items.map((item) => {
    const price = cheapestPrice([item]);
    return {
      id: item.id,
      name: item.name,
      categoryId: item.categoryId,
      categoryLabel: getCategory(item.categoryId)?.label ?? "",
      imageUrl: item.imageUrl,
      href: itemRoute(item.id),
      leadBadge: item.leadTimeHours === 0 ? "1 HOUR" : "24 HOURS",
      sameDay: item.leadTimeHours === 0,
      price: price === undefined ? "Ask us" : formatAed(price),
    };
  });
  const tabs = getCategories()
    .filter((category) => cards.some((card) => card.categoryId === category.id))
    .map((category) => ({ id: category.id, label: categoryShortLabel(category) }));
  return <MostOrdered cards={cards} tabs={tabs} />;
}

export function FlavourTiles() {
  return (
    <RailSection title="Browse by flavour" mobileMeta="Swipe →" arrows={false}>
      {getFlavourTags().map((tag) => (
        <Link key={tag.id} href={flavourRoute(tag.id)} className={`${styles.tile} ${styles.flavourTile}`}>
          <div className={styles.tileImage}>
            <Photo src={getFlavourTagImage(tag.id)} />
          </div>
          <div className={styles.tileLabel}>{tag.label}</div>
        </Link>
      ))}
    </RailSection>
  );
}

export function OrderingInfo() {
  return (
    <div className={styles.ordering}>
      <div className={styles.orderingSteps}>
        <div className={`${styles.orderingLabel} mono-tag`}>HOW ORDERING WORKS</div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>1</span>
          <div>Add your cakes and pick pickup or delivery.</div>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>2</span>
          <div>
            Send the order on WhatsApp — <span className={styles.desktopInline}>one click, </span>message already
            written.
          </div>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>3</span>
          <div>
            We confirm price and time in the chat. <strong>Nothing is charged in the app.</strong>
          </div>
        </div>
      </div>

      <div className={styles.orderingDivider} />

      <div className={styles.shopPanel}>
        <div className={styles.shopTitle}>Come to the shop</div>
        <div className={styles.shopText}>
          {CONFIG.address.line1}, {CONFIG.address.line2}, {CONFIG.address.line3}. Also on {CONFIG.alsoOnPlatforms}.
        </div>
        <div className={styles.shopActions}>
          <a href={buildWhatsAppUrl()} {...EXTERNAL_LINK_PROPS} className={styles.shopWhatsapp}>
            WHATSAPP US
          </a>
          <a href={CONFIG.mapsUrl} {...EXTERNAL_LINK_PROPS} className={styles.shopDirections}>
            GET DIRECTIONS
          </a>
        </div>
      </div>
    </div>
  );
}

// Mobile only — desktop has this as a card beside the hero banner.
export function CounterOnlyCard() {
  return (
    <div className={styles.counterCard}>
      <div className={styles.counterTitle}>Counter-only treats</div>
      <div className={styles.counterText}>
        Cupcakes, cookies and pastries aren&apos;t online — ask us on WhatsApp and we&apos;ll set them aside.
      </div>
      <a href={buildWhatsAppUrl()} {...EXTERNAL_LINK_PROPS} className={styles.counterButton}>
        MESSAGE THE SHOP
      </a>
    </div>
  );
}
