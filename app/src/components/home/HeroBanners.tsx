"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { Banner } from "@/types/banner";
import { BANNER_INTERVAL_MS, nextIndex, previousIndex, shouldAutoRotate } from "@/lib/carousel";
import type { HeroStyle } from "@/lib/config";
import { Photo } from "@/components/Photo";
import { withBasePath } from "@/lib/assets";
import styles from "./HomeSections.module.css";

// Home's hero: the banners take turns on their own (paused while the
// pointer or keyboard focus is on it, and never for reduced motion);
// the dots jump to one. A single banner shows no dots and never moves.
//
// The markup is one card that mobile always shows as-is. On desktop,
// `variant` restyles it: "boxed" leaves it as a card beside the side
// cards; "photo" (CLB Desktop Home v2, screens 6a/6b/7a/7b) stretches it
// edge to edge with the banner's own photo bleeding behind the whole
// thing — a floating panel for a "light" banner, the text sitting
// straight on the photo for a "brand" one — plus ← → arrows.
export function HeroBanners({ banners, variant = "boxed" }: { banners: Banner[]; variant?: HeroStyle }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const rotating = shouldAutoRotate(banners.length, reducedMotion) && !paused;
  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(
      () => setIndex((current) => nextIndex(current, banners.length)),
      BANNER_INTERVAL_MS,
    );
    // Restarting on `index` too (not just `rotating`) means a manual dot
    // or arrow click resets the countdown — the same one the active
    // dot's progress fill shows — instead of the next auto-advance
    // landing early because the old interval kept ticking underneath.
    return () => window.clearInterval(timer);
  }, [rotating, banners.length, index]);

  const current = index % banners.length;
  const banner = banners[current];
  const full = variant === "photo";
  const brand = banner.tone === "brand";
  const bleedPhoto = full ? banner.bleedPhotoUrl : undefined;

  return (
    <div
      className={[styles.banner, brand && styles.bannerBrand, full && styles.bannerPhoto].filter(Boolean).join(" ")}
      style={!full && banner.imageUrl ? { backgroundImage: `url(${withBasePath(banner.imageUrl)})` } : undefined}
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {bleedPhoto && (
        <>
          <span className={styles.bleedPhoto} aria-hidden="true">
            <Photo src={bleedPhoto} slot="heroBleed" />
          </span>
          <span className={styles.bleedFade} aria-hidden="true" />
        </>
      )}

      <div key={banner.id} className={styles.slide}>
        <div className={styles.slideText}>
          <span className={`${styles.bannerBadge} mono-tag`}>{banner.badge}</span>
          <h1 className={styles.bannerTitle}>
            {banner.title.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>
          <p className={styles.bannerBody}>{banner.body}</p>
          <div className={styles.bannerActions}>
            <Link href={banner.cta.href} className={styles.bannerCta}>
              {banner.cta.label}
            </Link>
            {banner.secondaryCta && (
              <Link href={banner.secondaryCta.href} className={styles.bannerLink}>
                {banner.secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
        {!full && banner.photoUrl && (
          <div className={styles.slidePhoto}>
            <span className={styles.slideCircle} />
            <span className={styles.slideFrame}>
              <Photo src={banner.photoUrl} />
            </span>
          </div>
        )}
      </div>

      {full && banners.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            aria-label="Previous banner"
            onClick={() => setIndex(previousIndex(current, banners.length))}
          >
            ←
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            aria-label="Next banner"
            onClick={() => setIndex(nextIndex(current, banners.length))}
          >
            →
          </button>
        </>
      )}

      {banners.length > 1 && (
        <div
          className={styles.dots}
          data-anim={reducedMotion ? "static" : rotating ? "running" : "paused"}
          style={{ "--dot-duration": `${BANNER_INTERVAL_MS}ms` } as CSSProperties}
        >
          {banners.map((b, i) => (
            <button
              key={b.id}
              type="button"
              className={styles.dot}
              data-active={i === current}
              aria-label={`Show banner ${i + 1} of ${banners.length}`}
              aria-current={i === current}
              onClick={() => setIndex(i)}
            >
              {/* The active dot fills over BANNER_INTERVAL_MS, in step with
                  the auto-advance timer above — a running countdown, not
                  just a "which slide" marker. Paused (hover/focus) freezes
                  it mid-fill; reduced motion shows it solid, no motion. */}
              <span className={styles.dotFill} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
