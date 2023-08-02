import React from 'react';
import Subnav from '../components/Sales/Subnav';
import DevRelHero from '../components/Sales/drm/devrel-hero';
import DevRelCore from '../components/Sales/drm/devrel-core';
import DevRelProblems from '../components/Sales/drm/devrel-problems';
/* import StepTest from '../components/Sales/drm/step-test'; */
import StepOne from '../components/Sales/drm/step-one';
import StepTwo from '../components/Sales/drm/step-two';
import StepThree from '../components/Sales/drm/step-three';
import Cta from '../components/Sales/drm/cta';
import Faq from '../components/Sales/drm/faq';
import ProductIntro from '../components/Sales/drm/product-intro';
import AnimateIn from '../components/Sales/drm/base/animateIn';

const DRM = () => {
  return (
    <main className='explore'>
      <div className='sticky top-0 z-50'>
        <Subnav />
      </div>
      <div className='flex-col gap-8 flex md:gap-16 bg-white overflow-hidden'>
        <DevRelHero />
        <AnimateIn direction='left'>
          <DevRelCore />
        </AnimateIn>
        <AnimateIn direction='right'>
          <DevRelProblems />
        </AnimateIn>
        <div className='lg:block hidden'>
          <AnimateIn direction='left'>
            <ProductIntro />
          </AnimateIn>
        </div>
        <AnimateIn direction='right'>
          {/*   <StepTest /> */}
          <StepOne />
        </AnimateIn>
        <AnimateIn direction='left'>
          <StepTwo />
        </AnimateIn>
        <AnimateIn direction='right'>
          <StepThree />
        </AnimateIn>
        <AnimateIn direction='left'>
          <Cta />
        </AnimateIn>
        <AnimateIn direction='right'>
          <Faq />
        </AnimateIn>
      </div>
    </main>
  );
};

export default DRM;
