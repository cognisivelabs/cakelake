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
      <Header />

      <div className={styles.body}>
        <div className={styles.content}>
          {/* Mobile only — desktop has the search in the header. */}
          <div className={styles.mobileSearch}>
            <HeaderSearch variant="mobile" />
          </div>

          <HomeHero />
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

      <InstallPrompt />
    </div>
  );
}
