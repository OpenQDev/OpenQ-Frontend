import React from 'react';
import Image from 'next/image';
import ExploreHeader from '../components/Sales/drm/landing-hero';
import { ChevronRightIcon } from '@primer/octicons-react';
import Link from 'next/link';
const ProductCard = ({ imgSrc, productName, productDescription, productTarget }) => {
  return (
    <div className='border-muted bg-dark-2 w-[22rem] border rounded-lg overflow-hidden pt-6 h-min'>
      <div>
        <Image src={imgSrc} width={500} className='h-[320px]' height={0} alt={`illustration with name ${imgSrc}`} />
      </div>
      <div className='flex gap-2 py-4 text-lg content-center font-bold items-center px-6 border-b border-web-gray'>
        {productName} <ChevronRightIcon className='stroke-[1px] h-4 w-4 stroke-white' />
      </div>
      <div className='px-6 h-20 py-4'>{productDescription}</div>
      <div className='px-6 text-muted text-sm py-4 '>{productTarget}</div>
    </div>
  );
};
const BenefitsCard = ({ src, forText, benefitsArray, children }) => {
  return (
    <div className='max-w-[400px] flex items-center lg:items-start flex-col gap-8'>
      <Image src={src} width={500} height={500} alt={`illustration with name ${src}`} />
      <h3 className='font-bold text-2xl'>{forText}</h3>
      <ul className='list-disc justify-center lg:justify-start space-y-2 text-muted text-xl'>
        {benefitsArray.map((benefit) => (
          <li className='relative left-4' key={benefit}>
            <span> {benefit}</span>
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
};
export default function Index() {
  return (
    <main className=' flex-col explore'>
      <div className='pb-48 px-8'>
        <ExploreHeader />
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
        <div className='pt-44 flex flex-col gap-8 items-center'>
          <div className='text-center max-w-[900px] font-bold text-[42px] leading-tight'>Unlock the power of OpenQ</div>
          <p className='text-muted text-lg max-w-[900px] text-center'>
            Whether you're a visionary developer creating groundbreaking technology or a forward-thinking company
            pursuing cutting-edge solutions, OpenQ is your steadfast companion, supporting you throughout the journey of
            building a vibrant developer ecosystems that will shape the world.
          </p>
        </div>
        <div className=' flex flex-col lg:flex-row justify-center items-center gap-24 pt-20'>
          <BenefitsCard
            src='/landingpage/home/forDevs.png'
            forText='For developers'
            benefitsArray={[
              'Unlock your creative potential and collaborate with a community of like-minded innovators.',
              'Participate in hackathons and solve rewarding bounties to showcase your skills and earn exciting prizes.',
            ]}
          >
            <Link
              href='/'
              className='text-xl flex text-black bg-white rounded-sm px-6 py-4 w-fit font-bold items-center gap-2'
            >
              <span className='whitespace-nowrap'> Sign up for the Builder Hub</span>
              <ChevronRightIcon className='stroke-[1px] h-4 w-4 stroke-black' />
            </Link>
          </BenefitsCard>
          <div className='border border-muted'></div>
          <BenefitsCard
            src='/landingpage/home/forCompanies.png'
            forText='For companies'
            benefitsArray={[
              'Elevate your developer relationships with our data-driven DRM solution.',
              "Explore Builder Hub's potential in fostering developer communities through hackathons and rewarding bounties that drive impactful advancements.",
            ]}
          >
            {' '}
            <Link
              href='/'
              className='text-xl flex text-white bg-dark-mode border-white border rounded-sm px-6 py-4 w-fit font-bold items-center gap-2'
            >
              <span> Contact Sales</span>
              <ChevronRightIcon className='stroke-[1px] h-4 w-4 stroke-black' />
            </Link>
          </BenefitsCard>
        </div>
      </div>
    </main>
  );
}
