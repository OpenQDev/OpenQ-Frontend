import React from 'react';
import Subnav from '../components/Sales/Subnav';
import DevRelHero from '../components/Sales/drm/devrel-hero';
import DevRelCore from '../components/Sales/drm/devrel-core';
import DevRelProblems from '../components/Sales/drm/devrel-problems';
import ProductIntro from '../components/Sales/drm/product-intro';
/* import StepTest from '../components/Sales/drm/step-test'; */
import StepOne from '../components/Sales/drm/step-one';
import StepTwo from '../components/Sales/drm/step-two';
import StepThree from '../components/Sales/drm/step-three';
import Cta from '../components/Sales/drm/cta';
import Faq from '../components/Sales/drm/faq';

const DRM = () => {
  return (
    <main className='explore'>
      <div className='sticky top-0 z-50'>
        <Subnav />
      </div>
      <div className='flex-col flex md:gap-48 gap-12 bg-white overflow-hidden'>
        <DevRelHero />
        <DevRelCore />
        <DevRelProblems />
        <ProductIntro />
        {/*   <StepTest /> */}
        <StepOne />
        <StepTwo />
        <StepThree />
        <Cta />
        <Faq />
      </div>
    </main>
  );
};

export default DRM;
