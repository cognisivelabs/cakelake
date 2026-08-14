import * as React from 'react';

/** Location / availability status pill — pistachio with a live dot when open, quiet cream when not. */
export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: 'open' | 'soon';
  children?: React.ReactNode;
}
export function StatusPill(props: StatusPillProps): JSX.Element;
