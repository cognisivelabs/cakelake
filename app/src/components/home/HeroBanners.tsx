"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Banner } from "@/data/banners";
import { BANNER_INTERVAL_MS, nextIndex, shouldAutoRotate } from "@/lib/carousel";
import { Photo } from "@/components/Photo";
import { withBasePath } from "@/lib/assets";
import styles from "./HomeSections.module.css";

// Home's hero: the banners take turns on their own (paused while the
// pointer or keyboard focus is on it, and never for reduced motion);
// the dots jump to one. A single banner shows no dots and never moves.
export function HeroBanners({ banners }: { banners: Banner[] }) {
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
    return () => window.clearInterval(timer);
  }, [rotating, banners.length]);

  const banner = banners[index % banners.length];

  return (
    <div
      className={`${styles.banner} ${banner.tone === "brand" ? styles.bannerBrand : ""}`}
      style={banner.imageUrl ? { backgroundImage: `url(${withBasePath(banner.imageUrl)})` } : undefined}
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
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
        {banner.photoUrl && (
          <div className={styles.slidePhoto}>
            <span className={styles.slideCircle} />
            <span className={styles.slideFrame}>
              <Photo src={banner.photoUrl} />
            </span>
          </div>
        )}
      </div>

      {banners.length > 1 && (
        <div className={styles.dots}>
          {banners.map((b, i) => (
            <button
              key={b.id}
              type="button"
              className={styles.dot}
              data-active={i === index % banners.length}
              aria-label={`Show banner ${i + 1} of ${banners.length}`}
              aria-current={i === index % banners.length}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
