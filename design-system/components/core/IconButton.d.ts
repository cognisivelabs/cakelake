import * as React from 'react';

/** Circular icon button: the ink "+" add-to-cart control and the outlined header cart/utility button. */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 38px solid ink (goes berry on hover) or 42px paper with a hairline border. */
  variant?: 'add' | 'outline';
  /** Berry mono count bubble pinned to the top-right. */
  badge?: number | string;
  children?: React.ReactNode;
}
export function IconButton(props: IconButtonProps): JSX.Element;
