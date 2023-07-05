import React from 'react';
import Subnav from '../components/Sales/Subnav';
import DevRelHero from '../components/Sales/drm/devrel-hero';
import DevRelCore from '../components/Sales/drm/devrel-core';

const Home = () => {
  return (
    <main className='explore'>
      <div className='sticky top-0 z-50'>
        <Subnav />
      </div>
      <div>
        <DevRelHero />
        <div className='flex flex-col bg-white justify-center items-center text-center pt-36 pb-96'>
          <div className='text-black text-4xl font-extrabold pt-3 w-[40rem]'>Real-time insights, for everything.</div>
          <div className='text-gray-800 pt-5 w-[29rem]'>
            OpenQ's DRM Platform offers real-time insights into developer activities, tracks project relevance, and
            enhances lorem ipsum.
          </div>
          <DevRelCore />
        </div>
      </div>
    </main>
  );
};

export default Home;
