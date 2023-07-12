import React from 'react';
import Image from 'next/image';

const OrgCard = ({ name, link, rounded }) => {
  return (
    <div>
      <div className='p-2 w-full border border-gray-300 bg-[#FBFBFB] rounded-sm'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex items-center space-x-3'>
            <div className='rounded-full' style={{ width: '20px', height: '20px', position: 'relative' }}>
              <Image
                className={`${rounded ? 'rounded-lg' : ''}`}
                src={link}
                alt='Centered Image'
                layout='fill'
                objectFit='cover'
              />
            </div>
            <div className='text-gray-800 font-semibold text-xs'>{name}</div>
          </div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='#626262'
            className='w-4 h-4'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default OrgCard;
