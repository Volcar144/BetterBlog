import type * as React from 'react';

declare namespace JSX {
  interface IntrinsicElements {
    'twisty-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}
