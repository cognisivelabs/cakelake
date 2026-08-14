import * as React from 'react';

/** Shop card. Live shops sit on paper with a hairline border; unopened ones are a dashed empty outline. */
export interface LocationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'open' | 'soon';
  statusLabel?: React.ReactNode;
  name: React.ReactNode;
  address?: React.ReactNode;
  /** Mono opening-hours line. */
  hours?: React.ReactNode;
}
export function LocationCard(props: LocationCardProps): JSX.Element;
