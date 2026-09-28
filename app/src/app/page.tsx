import { Header } from "@/components/Header";
import { HeaderSearch } from "@/components/HeaderSearch";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Footer } from "@/components/Footer";
import {
  CategoryTiles,
  CounterOnlyCard,
  FlavourTiles,
  HomeHero,
  MostOrderedSection,
  OccasionTiles,
  OrderingInfo,
  TrustStrip,
} from "@/components/home/HomeSections";
import styles from "./home.module.css";

// The merchandised Home — see docs CLB Desktop Home / CLB Mobile Home.
// Every tile, price and count is read from the catalog. Halloween and
// Valentine (in the design) join once the client supplies their content.
export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Above the header, not a floating card over the page — it pushes
          the header (and everything below) down, and scrolls away with
          the page (design: CLB Install Banner, 1b/1c). */}
      <InstallPrompt />
      <Header />

      <div className={styles.body}>
        {/* Mobile only — desktop has the search in the header. */}
        <div className={styles.mobileSearch}>
          <HeaderSearch variant="mobile" />
        </div>

        {/* Outside the width-capped column below so the "photo" hero style
            can bleed its photo to the screen edge (CONFIG.heroStyle). */}
        <div className={styles.heroSlot}>
          <HomeHero />
        </div>

        <div className={styles.content}>
          <TrustStrip />
          <CategoryTiles />
          <OccasionTiles />
          <MostOrderedSection />
          <FlavourTiles />
          <OrderingInfo />
          <CounterOnlyCard />
        </div>

        <Footer />
      </div>
    </div>
  );
}
