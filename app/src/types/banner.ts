/** One of Home's hero banners. */
export type Banner = {
  id: string;
  /** "light" is the soft panel; "brand" is the deep, promotional one. */
  tone?: "light" | "brand";
  /** Small pill above the headline, e.g. "READY IN 1 HOUR". */
  badge: string;
  /** Headline, one entry per line. */
  title: string[];
  /** Text under the headline. */
  body: string;
  /** The main button. */
  cta: { label: string; href: string };
  /** A quieter second link beside the button. */
  secondaryCta?: { label: string; href: string };
  /** "boxed" hero style only: a plain background photo behind a "light"
   * banner. */
  imageUrl?: string;
  /** "boxed" hero style only: a framed picture beside a "brand" banner's
   * text (desktop). */
  photoUrl?: string;
  /** "photo" hero style only: a photo filling the whole banner, behind
   * its text. */
  bleedPhotoUrl?: string;
};
