import React from 'react';
import ProductCard from './ProductCard';

const ProductSection = () => {
  return (
    <div className='w-full flex flex-col items-center content-center '>
      <div className=' text-xl text-left sm:text-center md:text-2xl sm:w-auto: w-full text-zinc-400'>Our products</div>
      <div className='md:pb-20 pb-8 text-left sm:w-auto: w-full  sm:text-center max-w-[1500px] font-bold text-[42px] leading-tight  text-2xl  md:leading-tight md:text-[42px]'>
        <span
          style={{
            background: 'linear-gradient(90deg, #EFCEFF, #A481FF, #4768FF)',
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent',
          }}
          className='md:text-[#533AED] md:block block '
        >
          Supercharge collaboration
        </span>
      </div>

      <div className='grid xl:grid-cols-3 grid-cols gap-8 justify-center gap'>
        <ProductCard
          href='/drm'
          imgSrc='/landingpage/home/laptopSunset.png'
          productName='DRM'
          productDescription='A platform tailored for managing and nurturing developer relationships.'
          productTarget='For organizations'
        />
        <ProductCard
          href='/explore'
          imgSrc={'/landingpage/home/cafe.png'}
          productName='Hackathon Launchpad'
          productDescription='A comprehensive platform for organizing and managing hackathons with ease.'
          productTarget='For organizations & developers'
        />
        <ProductCard
          href='/explore'
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
