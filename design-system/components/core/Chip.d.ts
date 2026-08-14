import * as React from 'react';

/** Small mono metadata pill: product attributes, offer tags, and payment-method marks. */
export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** neutral = product attributes, offer = pistachio promo tag, pay = square-ish footer payment chip. */
  tone?: 'neutral' | 'offer' | 'pay';
  children?: React.ReactNode;
}
export function Chip(props: ChipProps): JSX.Element;
