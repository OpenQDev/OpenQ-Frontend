import React from 'react';
import BenefitsCard from './BenefitsCard';
import Link from 'next/link';
import { ChevronRightIcon } from '@primer/octicons-react';

const BenefitsSection = () => {
  return (
    <>
      <div className='pt-44 flex flex-col gap-8 items-center'>
        <div className='text-center max-w-[900px] font-bold text-[42px] leading-tight'>Unlock the power of OpenQ</div>
        <p className='text-muted text-lg max-w-[900px] text-center'>
          Whether you're a visionary developer creating groundbreaking technology or a forward-thinking company pursuing
          cutting-edge solutions, OpenQ is your steadfast companion, supporting you throughout the journey of building a
          vibrant developer ecosystems that will shape the world.
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
            href='/login'
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
          <Link
            href='/'
            className='text-xl flex text-white bg-dark-mode border-white border rounded-sm px-6 py-4 w-fit font-bold items-center gap-2'
          >
            <span> Contact Sales</span>
            <ChevronRightIcon className='stroke-[1px] h-4 w-4 stroke-black' />
          </Link>
        </BenefitsCard>
      </div>
    </>
  );
};
export default BenefitsSection;
