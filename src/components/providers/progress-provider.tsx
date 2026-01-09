'use client';

import NextTopLoader from 'nextjs-toploader';

export function ProgressProvider() {
  return (
    <NextTopLoader
      color='#00a120'
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing='ease'
      speed={200}
      shadow='0 0 10px #00a120,0 0 5px #00a120'
      zIndex={1600}
    />
  );
}
