import React from 'react';
import Image from 'next/image';

export default function CRMContextTwo() {
  return (
    <div className='max-w-[27rem] md:h-[17.2rem] md:pb-0 pb-16 rounded-lg  px-8 flex items-center content-center'>
      <div>
        <Image width={432} height='100' className='rounded-lg' src='/landingpage/drm/devrel/HubSpotWhine.png' />
      </div>
    </div>
  );
}
