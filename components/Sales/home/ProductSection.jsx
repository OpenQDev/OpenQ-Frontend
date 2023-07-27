import React from 'react';
import ProductCard from './ProductCard';

const ProductSection = () => {
  return (
    <div className='w-full flex flex-col items-center content-center '>
      <div className='md:pt-60 pt-20 pb-20 text-center max-w-[900px] font-bold text-[42px] leading-tight  text-4xl  md:leading-tight md:text-[42px]'>
        <span className='text-[#533AED] '>Supercharge collaboration</span>{' '}
        <span>Empowering innovators, builders and visionaries with our trio of vital collaboration tools.</span>
      </div>

      <div className='grid xl:grid-cols-3 grid-cols gap-20 justify-center gap'>
        <ProductCard
          imgSrc='/landingpage/home/laptopSunset.png'
          productName='DRM'
          productDescription='A platform tailored for managing and nurturing developer relationships.'
          productTarget='For organizations'
        />
        <ProductCard
          imgSrc={'/landingpage/home/cafe.png'}
          productName='Hackathon Launchpad'
          productDescription='A comprehensive platform for organizing and managing hackathons with ease.'
          productTarget='For organizations & developers'
        />
        <ProductCard
          imgSrc={'/landingpage/home/iceHouse.png'}
          productName='Developer Marketplace'
          productDescription='A developer bounty marketplace built on top of web3.'
          productTarget='For organizations & developers'
        />
      </div>
    </div>
  );
};

export default ProductSection;
