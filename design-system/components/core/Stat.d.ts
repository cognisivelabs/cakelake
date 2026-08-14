import * as React from 'react';

/** Mono figure + uppercase caption; used in a row under the hero copy. */
export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  value: React.ReactNode;
  label: React.ReactNode;
  tone?: 'light' | 'dark';
}
export function Stat(props: StatProps): JSX.Element;
