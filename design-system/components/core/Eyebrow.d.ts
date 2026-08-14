import * as React from 'react';

/** Mono uppercase section kicker with a leading dot — sits above every section heading. */
export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** berry on light backgrounds, honey inside dark ink blocks. */
  tone?: 'berry' | 'honey';
  children?: React.ReactNode;
}
export function Eyebrow(props: EyebrowProps): JSX.Element;
