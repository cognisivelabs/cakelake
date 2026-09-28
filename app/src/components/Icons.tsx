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

/** Solid, not outline (unlike the other icons here) — a small filled
 * star reads at a glance where an outline one would just look grey at
 * this size. Used as the mobile menu card's compact "Most ordered"
 * marker, in place of the text tag desktop has room for. */
export function StarIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5l2.9 6.4 6.9.7-5.2 4.7 1.5 6.8L12 17.6l-6.1 3.5 1.5-6.8-5.2-4.7 6.9-.7z" />
    </svg>
  );
}
