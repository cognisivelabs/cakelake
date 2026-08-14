import * as React from 'react';

/** Coupon-style promo card: dashed berry border and two punch-hole notches on the sides. */
export interface OfferCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Pistachio offer chip, e.g. "Ends Fri". */
  tag?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Mono promo code shown in the tear-off strip. */
  code?: React.ReactNode;
  /** Must match the surface behind the card so the notches read as cut-outs. */
  punchColor?: string;
}
export function OfferCard(props: OfferCardProps): JSX.Element;
