import * as React from 'react';

/**
 * The brand's signature element: order status drawn as a cake being built layer by layer,
 * beside a stage list. Use ONLY for order tracking — it loses meaning as decoration.
 * @startingPoint section="Tracking" subtitle="Layer-cake order status tracker" viewport="700x380"
 */
export interface OrderTrackerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Four stages by default: placed → oven → decorating → ready. */
  stages?: Array<{ title: string; sub?: string }>;
  /** Index of the in-progress stage; earlier stages render done (pistachio ✓). */
  current?: number;
  /** Mono order reference, e.g. "ORDER #LY-4471". */
  orderId?: React.ReactNode;
  eta?: React.ReactNode;
  /** Slot under the stage list — usually an inverse Button. */
  footer?: React.ReactNode;
}
export function OrderTracker(props: OrderTrackerProps): JSX.Element;
