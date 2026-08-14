import * as React from 'react';

/** Pill filter tab for menu categories; the active one inverts to solid ink. */
export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children?: React.ReactNode;
}
export function Tab(props: TabProps): JSX.Element;
