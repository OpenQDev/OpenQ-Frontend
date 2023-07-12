import React from 'react';
import Image from 'next/image';

export default function CRMContext() {
  return (
    <div className='w-[27rem]'>
      <div className='bg-gray-200 w-fit text-black text-sm italic font-normal px-4 rounded-lg py-1 text-center'>
        Get hundreds of devs interacting with your tech.
      </div>
      <div className='flex flex-row space-x-3 items-center pt-2'>
        <div>
          <Image className='rounded-lg' src='/landingpage/drm/devrel/icons/andrew.jpg' width={24} height={24} />
        </div>
        <div className='border broder-gray-800 text-black text-sm px-4 py-1 rounded-lg text-center'>
          Let's see who these guys are.
        </div>
      </div>
      <div className='flex flex-row space-x-3 items-center pt-2'>
        <div>
          <Image className='rounded-lg' src='/landingpage/drm/devrel/icons/down.png' width={24} height={24} />
        </div>
        <div className=' bg-yellow-200 text-black text-sm px-4 py-1 rounded-lg text-center'>
          Inspect data on Github to verify status of developers.
        </div>
      </div>
      <div className='flex flex-row space-x-3 items-center pt-2'>
        <div>
          <Image className='rounded-lg' src='/landingpage/drm/devrel/icons/andrew.jpg' width={24} height={24} />
        </div>
        <div className='border broder-gray-800 text-black text-sm px-4 py-1 rounded-lg text-center'>
          I'm not learning much here this is not worth my time.
        </div>
      </div>
      <div className='flex flex-row space-x-3 items-center pt-2'>
        <div>
          <Image className='rounded-lg' src='/landingpage/drm/devrel/icons/rick.png' width={24} height={24} />
        </div>
        <div className='border broder-gray-800 text-black text-sm px-4 py-1 rounded-lg text-center'>
          Andrew what is the ROI on our last hackathon?
        </div>
      </div>
      <div className='flex flex-row space-x-3 items-center pt-2'>
        <div>
          <Image className='rounded-lg' src='/landingpage/drm/devrel/icons/andrew.jpg' width={24} height={24} />
        </div>
        <div className='border broder-gray-800 text-black text-sm px-4 py-1 rounded-lg text-center'>
          Not sure, let me check.
        </div>
      </div>
      <div className='flex flex-row space-x-3 items-center pt-2'>
        <div>
          <Image className='rounded-lg' src='/landingpage/drm/devrel/icons/cry.png' width={24} height={24} />
        </div>
        <div className=' bg-yellow-200 text-black text-sm px-4 py-1 rounded-lg text-center'>
          Checking Github activity of users.
        </div>
      </div>
      <div className='flex flex-row space-x-3 items-center pt-2'>
        <div>
          <Image className='rounded-lg' src='/landingpage/drm/devrel/icons/andrew.jpg' width={24} height={24} />
        </div>
        <div className='border broder-gray-800 text-black text-sm px-4 py-1 rounded-lg text-center'>
          There must be a better way to do this.
        </div>
      </div>
    </div>
  );
}
