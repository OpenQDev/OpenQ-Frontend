import React from 'react';
import Image from 'next/image';
import BenefitsSection from '../components/Sales/home/BenefitsSection';
import ProductSection from '../components/Sales/home/ProductSection';
import ExploreHeader from '../components/Sales/drm/landing-hero';
import AnimateIn from '../components/Sales/drm/base/animateIn';

export default function Index() {
  return (
    <main className=' relative flex-col overflow-hidden explore'>
      <div className='pb-48 relative z-20 px-8'>
        <ExploreHeader />
        <AnimateIn direction='left'>
          <ProductSection />
        </AnimateIn>
        <AnimateIn direction='right'>
          <BenefitsSection />
        </AnimateIn>
      </div>
      <div className='absolute inset-0 z-10  '>
        <div className='h-[100vh]'></div>
        <Image src='/landingpage/home/universeBg1.png' width='1903' height='1224' />
        <div className='flex justify-between w-full'>
          <Image src='/landingpage/home/universeBg2.png' width='359' height='1254' />
          <Image src='/landingpage/home/universeBg3.png' width='1266' height='1269' />
        </div>
      </div>
    </main>
  );
}
