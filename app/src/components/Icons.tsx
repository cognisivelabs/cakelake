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
 * size. A flame, not a star: the standard marker for "popular" /
 * "bestseller" on food ordering apps, and the one shoppers actually
 * recognise for it. Used as the mobile menu card's compact "Most
 * ordered" marker, in place of the text tag desktop has room for. */
export function FlameIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.5 2c.3 2.3-.6 3.9-2 5.4-1.6 1.7-3.3 3.5-3.3 6.3a4.8 4.8 0 0 0 9.6 0c0-1-.3-1.8-.7-2.6.9.4 1.9 1.5 1.9 3.4a5.9 5.9 0 0 1-5.8 6 6.2 6.2 0 0 1-6.2-6.3c0-3.6 2.1-5.7 3.9-7.6C11.4 5 12.7 3.7 12.5 2z" />
    </svg>
  );
}
