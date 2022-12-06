// Third Party
import React, { useRef, useEffect } from 'react';
import jazzicon from '@metamask/jazzicon';
import Image from 'next/image';
//Custom
import CopyAddressToClipboard from '../../Copy/CopyAddressToClipboard';

const AboutTitle = ({ ensName, account, githubUser }) => {


  return (
    <div className='sm:flex flex-wrap items-center font-semibold pt-8 px-8 gap-4 w-full'>
      {githubUser && (
        <a href={githubUser.url} className='flex gap-4 lg:hidden group flex-1 pb-4'>
          <Image className='rounded-full' src={githubUser.avatarUrl} width={32} height={32} alt='avatar' />
          <span className='flex leading-none'>
            <span className='flex pt-2 group-hover:underline whitespace-nowrap'>{githubUser?.login}</span>
          </span>
        </a>
      )}
     
    </div>
  );
};

export default AboutTitle;
