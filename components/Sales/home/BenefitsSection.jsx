import React from 'react';
import BenefitsCard from './BenefitsCard';
import Link from 'next/link';
import { ChevronRightIcon } from '@primer/octicons-react';

const BenefitsSection = () => {
  return (
    <>
      <div className='pt-32 md:pt-44 flex flex-col gap-8 items-center'>
        <div className='text-left lg:text-center max-w-[900px] font-bold text-[42px] leading-tight'>
          Unlock the power of OpenQ
        </div>
        <p className='text-muted text-lg max-w-[900px] text-left md:text-center'>
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
            className='text-xl flex text-black lg:ml-0 bg-white rounded-sm px-6 py-4 w-fit font-bold items-center gap-2'
          >
            <span className='whitespace-nowrap'> Sign up for the builder hub</span>
            <ChevronRightIcon className='stroke-[1px] h-4 w-4 stroke-black' />
          </Link>
        </BenefitsCard>
        <div className='border hidden lg:block border-muted h-[760px] w-[1px]'></div>
        <BenefitsCard
          src='/landingpage/home/forCompanies.png'
          forText='For companies'
          benefitsArray={[
            'Elevate your developer relationships with our data-driven DRM solution.',
            "Explore the builder hub's potential in fostering developer communities through hackathons and rewarding bounties that drive impactful advancements.",
          ]}
        >
          <Link
            href='https://calendly.com/ricketh/openqdemo'
            className='text-xl flex text-white lg:ml-0 w-80 bg-dark-mode border-transparent border rounded-sm px-6 pl-0 py-4  font-bold items-center gap-2'
          >
            <div className='pb-1 '>
              <div>Schedule a demo</div>
              <div className='border-t border-white'></div>
            </div>
            <ChevronRightIcon className='stroke-[1px] h-4 w-4 stroke-black' />
          </Link>
        </BenefitsCard>
      </div>
    </>
  );
};
export default BenefitsSection;
