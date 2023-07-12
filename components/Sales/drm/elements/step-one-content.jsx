import React, { useState, useEffect, useRef } from 'react';
import OrgCard from './org-card';

const StepOneContent = () => {
  const [isVisibleStates, setIsVisibleStates] = useState([false, false, false, false, false, false, false]);
  const parentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1, // Adjust this value as needed
    });

    if (parentRef.current) {
      observer.observe(parentRef.current);
    }

    return () => {
      if (parentRef.current) {
        observer.unobserve(parentRef.current);
      }
    };
  }, []);

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.target === parentRef.current && entry.isIntersecting) {
        let count = 0;
        const interval = setInterval(() => {
          setIsVisibleStates((prevStates) => {
            const updatedStates = [...prevStates];
            updatedStates[count] = true;
            return updatedStates;
          });

          count++;
          if (count === 7) {
            clearInterval(interval);
          }
        }, 300);
      }
    });
  };

  return (
    <div ref={parentRef} className='h-[38rem] w-[60rem] border border-gray-300 rounded-md'>
      <div className='p-10'>
        <div className='text-gray-800 font-semibold text-lg pb-2'>Add targets</div>
        <div className='border border-gray-300 bg-[#F2F2F2] p-2 px-5 w-full rounded-sm'>
          <div className='text-gray-900 typewriter-text'>https://www.github.com/openqdev</div>
        </div>
        <div className='text-gray-800 pt-5 font-semibold text-md'>Found targets</div>
        <div className='text-gray-500 pt-2'>Remove targets you don't want to track</div>
        {/* This part should only be visible after the typing animation is done */}
        {isVisibleStates[0] && (
          <div className='flex flex-row justify-between items-center'>
            <div className='text-gray-800 pt-5 text-sm font-semibold'>Organizations</div>
            <div className='flex flex-row space-x-2 items-center mt-5'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='#606060'
                className='w-4 h-4'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
              <div className='text-gray-900 text-xs font-semibold'>Remove all</div>
            </div>
          </div>
        )}

        <div className='flex flex-row w-full space-x-3 pt-2'>
          {isVisibleStates[0] && (
            <div className='w-1/2'>
              <OrgCard name={'OpenQ Labs'} link={'/openq-logo.png'} />
            </div>
          )}
          {/* <div className='flex-grow'>
            <OrgCard name={'OpenQ Labs'} link={'/openq-logo.png'} />
          </div> */}
        </div>

        {isVisibleStates[2] && (
          <div className='flex flex-row justify-between items-center'>
            <div className='text-gray-800 pt-5 text-sm font-semibold'>Repositories</div>
            <div className='flex flex-row space-x-2 items-center mt-5'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='#606060'
                className='w-4 h-4'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
              <div className='text-gray-900 text-xs font-semibold'>Remove all</div>
            </div>
          </div>
        )}
        <div>
          <div className='flex flex-row w-full space-x-3 pt-2'>
            {isVisibleStates[3] && (
              <div className='w-1/2'>
                <OrgCard name={'OpenQDev/OpenQ-Frontend'} link={'/openq-logo.png'} />
              </div>
            )}
            {isVisibleStates[4] && (
              <div className='w-1/2'>
                <OrgCard name={'OpenQDev/OpenQ-Contracts'} link={'/openq-logo.png'} />
              </div>
            )}
          </div>

          <div className='flex flex-row w-full space-x-3 pt-2'>
            {isVisibleStates[5] && (
              <div className='w-1/2'>
                <OrgCard name={'OpenQDev/OpenQ-Subgraph'} link={'/openq-logo.png'} />
              </div>
            )}
            {isVisibleStates[5] && (
              <div className='w-1/2'>
                <OrgCard name={'OpenQDev/Helm'} link={'/openq-logo.png'} />
              </div>
            )}
          </div>
        </div>

        {isVisibleStates[6] && (
          <div className='flex flex-row justify-between items-center'>
            <div className='text-gray-800 pt-5 text-sm font-semibold'>Contributors</div>
            <div className='flex flex-row space-x-2 items-center mt-5'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='#606060'
                className='w-4 h-4'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
              <div className='text-gray-900 text-xs font-semibold'>Remove all</div>
            </div>
          </div>
        )}
        <div>
          {isVisibleStates[6] && (
            <div className='flex flex-row w-full space-x-3 pt-2'>
              <div className='w-1/2'>
                <OrgCard name={'FlacoJones'} link={'/landingpage/drm/devrel/icons/andrew.jpg'} rounded={true} />
              </div>
              <div className='w-1/2'>
                <OrgCard name={'Rickkdev'} link={'/landingpage/drm/devrel/icons/rick.png'} rounded={true} />
              </div>
            </div>
          )}
        </div>
        <div className='flex justify-end pt-5'>
          <div className='rounded-sm bg-[#533AED] p-2'>
            <div className='text-white font-semibold text-sm'>Add</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOneContent;
