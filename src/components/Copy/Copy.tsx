import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  // Reference-API kept so the page JSX doesn't need rewriting.
  delay?: number;
  animateOnScroll?: boolean;
};

// Pass-through. The reference uses GSAP SplitText to slide each line
// up, but that hides content via CSS first — so any failure in the
// split / trigger path leaves the page blank. We render children as
// they are; visual animation can be reintroduced later once the page
// renders reliably.
export default function Copy({ children }: Props) {
  return <>{children}</>;
}
