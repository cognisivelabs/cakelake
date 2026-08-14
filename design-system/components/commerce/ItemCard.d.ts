import * as React from 'react';

/**
 * Product card: pistachio illustration well, attribute chips, Fraunces name, mono price, ink add button.
 * @startingPoint section="Commerce" subtitle="Menu product card with add-to-cart" viewport="700x400"
 */
export interface ItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: React.ReactNode;
  description?: React.ReactNode;
  /** Pre-formatted, mono — e.g. "AED 145". */
  price: React.ReactNode;
  /** Attribute chips, e.g. ["Bestseller", "Eggless option"]. */
  chips?: string[];
  /** Illustration src or a node rendered in the media well. */
  image?: string | React.ReactNode;
  onAdd?: React.MouseEventHandler<HTMLButtonElement>;
}
export function ItemCard(props: ItemCardProps): JSX.Element;
