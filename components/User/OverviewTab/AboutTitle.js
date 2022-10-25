// Third Party
import React, { useRef, useEffect } from 'react';
import jazzicon from '@metamask/jazzicon';
import Image from 'next/image';
//Custom
import CopyAddressToClipboard from '../../Copy/CopyAddressToClipboard';

const AboutTitle = ({ ensName, account, githubUser }) => {
  const iconWrapper = useRef(null);

  useEffect(async () => {
    if (account && iconWrapper.current) {
      iconWrapper.current.innerHTML = '';
      iconWrapper.current.appendChild(jazzicon(36, parseInt(account.slice(2, 10), 16)));
    }
  }, [account]);

  return (
    <div className='sm:flex flex-wrap items-center font-semibold pt-8 px-8 gap-4 w-full'>
      {githubUser && (
        <a href={githubUser.url} className='flex gap-4 lg:hidden group flex-1 pb-4'>
          <Image className='rounded-full' src={githubUser.avatarUrl} width={32} height={32} />
          <span className='flex leading-none'>
            <span className='flex pt-2 group-hover:underline whitespace-nowrap'>{githubUser?.login}</span>
          </span>
        </a>
      )}
      <h1 className='flex gap-4 flex-1 pb-8'>
        <span className='flex lg:hidden' ref={iconWrapper}></span>
        <span className='flex flex-col leading-none'>
          <span className='flex'>{ensName}</span>
          <CopyAddressToClipboard data={account} clipping={[5, 38]} />
        </span>
      </h1>
    </div>
  );
};

export default AboutTitle;
