import type { ReactNode } from "react";

// Small inline icons shared by more than one component.

type IconProps = { size?: number; className?: string };

function Icon({ size, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function SearchIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 21 21" />
    </Icon>
  );
}

export function WhatsAppIcon({ size = 20, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 20.5l1.7-5.5A8.4 8.4 0 1 1 21 11.5z" />
    </Icon>
  );
}

/** Solid, not outline (unlike the other icons here) — a filled glyph
 * reads at a glance where an outline one would just look grey at this
 * size. A crown, not a flame: "bestseller" without the "hot/spicy food"
 * read a flame carries, and a shape that still reads clearly at 16px
 * where a flat star just looked flat. Used as the mobile menu card's
 * compact "Most ordered" marker, in place of the text tag desktop has
 * room for. */
export function CrownIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3 8.5l4.2 2.8L12 4l4.8 7.3L21 8.5l-1.7 9.5a1 1 0 0 1-1 .8H5.7a1 1 0 0 1-1-.8L3 8.5z" />
    </svg>
  );
}
