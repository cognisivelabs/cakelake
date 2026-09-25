/** How long each hero banner stays up before the next one, in ms. */
export const BANNER_INTERVAL_MS = 6000;

/** The slide after `current`, wrapping round to the first. */
export function nextIndex(current: number, count: number): number {
  return count <= 0 ? 0 : (current + 1) % count;
}

/**
 * Whether a carousel should rotate by itself: only with something to
 * rotate to, and never for someone who's asked their device for less
 * motion.
 */
export function shouldAutoRotate(count: number, prefersReducedMotion: boolean): boolean {
  return count > 1 && !prefersReducedMotion;
}
