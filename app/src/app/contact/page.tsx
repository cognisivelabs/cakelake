import type { Metadata } from "next";
import { CONFIG } from "@/lib/config";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import { ROUTES } from "@/lib/routes";
import { withBasePath } from "@/lib/assets";
import { SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/og";
import { PageHeader } from "@/components/PageHeader";
import { Header } from "@/components/Header";
import styles from "./contact.module.css";

const DESCRIPTION = `${CONFIG.address.line1}, ${CONFIG.address.line2}, ${CONFIG.address.line3}.`;

export const metadata: Metadata = {
  title: "Find us",
  description: DESCRIPTION,
  // See lib/og.ts: openGraph doesn't deep-merge with the root layout's,
  // so siteName/type/image are repeated here rather than inherited.
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    url: withBasePath(ROUTES.contact),
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.mobileHeaderWrap}>
        <PageHeader title="Find us" backHref={ROUTES.home} backLabel="BACK" />
      </div>
      <div className={styles.desktopHeaderWrap}>
        <Header />
      </div>

      <div className={styles.desktopGrid}>
        <iframe
          className={styles.map}
          src={CONFIG.mapsEmbedSrc}
          title="Cake Lake Bakery location"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />

        <div className={styles.leftCol}>
          {/* Desktop only — see docs/design/CLB-Hi-Fi-Screens.dc.html's
              "Find us — desktop": mobile's PageHeader title already says
              "Find us", so this heading + subtitle is new content, not
              a copy of anything mobile shows. Lives inside .leftCol
              (not as its own row above the grid) so its top lines up
              with the map's, matching the Hi-Fi — measured directly off
              the rendered canvas, both start at the same y. */}
          <div className={styles.desktopIntro}>
            <h1>Find us in Karama</h1>
            <p>A live bakery — walk in and collect, or message us and we&apos;ll bake it for a time that suits you.</p>
          </div>

          <div className={styles.content}>
            <section>
              <div className={styles.sectionLabel}>WHERE</div>
              <div className={styles.sectionContent}>
                <p className={styles.text}>
                  {CONFIG.address.line1}
                  <br />
                  {CONFIG.address.line2}
                  <br />
                  {CONFIG.address.line3}
                </p>
              </div>
            </section>

            <section>
              <div className={styles.sectionLabel}>WHEN</div>
              <div className={styles.sectionContent}>
                <div className={styles.hoursList}>
                  {CONFIG.openingHoursByDay.map((entry) => (
                    <div key={entry.day} className={styles.row}>
                      <span>{entry.day}</span>
                      <span>{entry.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <div className={styles.sectionLabel}>CALL OR MESSAGE</div>
              <div className={styles.sectionContent}>
                <div className={styles.row}>
                  <span>Shop</span>
                  <span>{CONFIG.shopPhone}</span>
                </div>
                <div className={styles.row}>
                  <span>WhatsApp</span>
                  <span>{formatDisplay(CONFIG.bakeryWhatsAppNumber)}</span>
                </div>
              </div>
            </section>
          </div>

          <div className={styles.actions}>
            <a
              href={CONFIG.mapsUrl}
              {...EXTERNAL_LINK_PROPS}
              className={styles.outlineButton}
            >
              OPEN IN MAPS
            </a>
          </div>
        </div>
      </div>

      {/* Desktop only — same footer band as Home's, no mobile
          equivalent to toggle against here (this page has no footer at
          all below 1024px). */}
      <div className={styles.desktopFooter}>
        <div className={styles.desktopFooterInner}>
          <div className={styles.desktopFooterColumn}>
            <div className={`${styles.footerLabel} mono-tag`}>WHERE TO FIND US</div>
            <p className={styles.footerText}>
              {CONFIG.address.line1}
              <br />
              {CONFIG.address.line2}, {CONFIG.address.line3}
              <br />
              {CONFIG.shopPhone}
            </p>
          </div>
          <div className={styles.desktopFooterColumn}>
            <div className={`${styles.footerLabel} mono-tag`}>ORDERING</div>
            <p className={styles.footerText}>Orders are confirmed in WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDisplay(intlNumber: string): string {
  // "971529811358" -> "052 981 1358"
  const local = "0" + intlNumber.slice(3);
  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}
