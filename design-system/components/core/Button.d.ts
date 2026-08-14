import * as React from 'react';

/**
 * Pill button. Honey primary for the single most important action per section;
 * outlined ghost for everything else; inverse only inside dark ink blocks.
 * @startingPoint section="Core" subtitle="Pill buttons — primary, ghost, inverse" viewport="700x220"
 */
export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  /** Honey fill, outlined, or the dark-section outline treatment. */
  variant?: 'primary' | 'ghost' | 'inverse';
  size?: 'md' | 'sm';
  disabled?: boolean;
  /** Renders an <a> instead of a <button>. */
  href?: string;
  children?: React.ReactNode;
}
export function Button(props: ButtonProps): JSX.Element;
