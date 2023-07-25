import React from 'react';
import ExploreHeader from '../components/Sales/drm/landing-hero';

export default function Index() {
  return (
    <main className='bg-dark-mode flex-col explore'>
      <div>
        <ExploreHeader />
        {/*  <ProductOverview /> */}
        <div className='pt-20 pb-96'></div>
      </div>
    </main>
  );
}
