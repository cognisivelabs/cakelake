import * as React from 'react';

/** Eyebrow + Fraunces H2 + optional description and right-aligned action — opens every page section. */
export interface SectionHeadProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Rendered flush right, baseline-aligned with the title (usually a ghost Button). */
  action?: React.ReactNode;
  tone?: 'light' | 'dark';
}
export function SectionHead(props: SectionHeadProps): JSX.Element;
