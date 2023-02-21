// Third party
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@primer/octicons-react';
import { ethers } from 'ethers';
import Link from 'next/link';
import OpenQSocials from './OpenQSocials';
import LoadingBar from '../Loading/LoadingBar';

// Custom
import CopyAddressToClipboard from '../CopyAddressToClipboard';
import Image from 'next/image';

const Footer = () => {
  const [toggle, setToggle] = useState(1);
  const [open, setOpen] = useState();
  const modal = useRef();

  const year = new Date().getFullYear();
  useEffect(() => {
    let didCancel;
    // Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    function handleClickOutside(event) {
      if (modal.current && !modal.current.contains(event.target) && !didCancel) {
        setOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      didCancel = true;
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);
  return (
    <div className='px-12 pb-20'>
      <div className='flex p-4 justify-between items-center border-b border-web-gray text-muted'>
        <OpenQSocials />
        <div className='flex'>
          <div className='flex lg:gap-2 items-center'>
            <div onClick={() => setOpen(!open)} className='flex gap-2 cursor-pointer'>
              <span> Smart Contracts</span>
              {open ? (
                <span>
                  <ChevronUpIcon />
                </span>
              ) : (
                <span onClick={() => setOpen(!open)}>
                  <ChevronDownIcon />
                </span>
              )}
            </div>
            <div className='relative h-6'>
              <div
                className={`relative px-3 w-40 ${open && 'left-0.25 rounded-sm border bg-dark-mode border-web-gray'}`}
              >
                {open ? (
                  <div ref={modal}>
                    <button onClick={() => setToggle(1)} value={1} className='block'>
                      <CopyAddressToClipboard
                        clipping={[5, 38]}
                        data={process.env.NEXT_PUBLIC_OPENQ_PROXY_ADDRESS}
                        styles='pt-0 w-40'
                      />
                    </button>

                    <button onClick={() => setToggle(2)} value={2} className='block'>
                      <CopyAddressToClipboard
                        clipping={[5, 38]}
                        data={process.env.NEXT_PUBLIC_DEPOSIT_MANAGER_PROXY_ADDRESS}
                        styles='pt-0 w-40'
                      />
                    </button>
                    <button onClick={() => setToggle(3)} value={3} className='block'>
                      <CopyAddressToClipboard
                        clipping={[5, 38]}
                        data={process.env.NEXT_PUBLIC_CLAIM_MANAGER_PROXY_ADDRESS}
                        styles='pt-0 w-40'
                      />
                    </button>
                  </div>
                ) : toggle === 1 ? (
                  <button value={1} className='block'>
                    <CopyAddressToClipboard
                      clipping={[5, 38]}
                      data={process.env.NEXT_PUBLIC_OPENQ_PROXY_ADDRESS}
                      styles='pt-0 w-40'
                    />
                  </button>
                ) : toggle === 2 ? (
                  <button value={2} className='block'>
                    <CopyAddressToClipboard
                      clipping={[5, 38]}
                      data={process.env.NEXT_PUBLIC_DEPOSIT_MANAGER_PROXY_ADDRESS}
                      styles='pt-0 w-40'
                    />
                  </button>
                ) : (
                  <button value={3} className='block'>
                    <CopyAddressToClipboard
                      clipping={[5, 38]}
                      data={ethers.utils.getAddress(process.env.NEXT_PUBLIC_CLAIM_MANAGER_PROXY_ADDRESS || '')}
                      styles='pt-0 w-40'
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className='flex lg:gap-4 items-center'>
            {process.env.NEXT_PUBLIC_BUILD_NUMBER ? (
              <div>Build: {process.env.NEXT_PUBLIC_BUILD_NUMBER}</div>
            ) : (
              <div>Build: production-1.0.22</div>
            )}
            <div className=''>
              <span className='whitespace-nowrap'>©</span> {year}, OpenQ Labs GmbH
            </div>
          </div>
        </div>
      </div>
      <div className='mt-6 sm:grid sm:grid-cols-[1fr_1fr_1fr_3fr]'>
        <div className='flex flex-col pb-8'>
          <h1 className='font-bold pb-2'>HELP ME</h1>
          <Link
            href={'https://openq.canny.io/openq-feature-requests'}
            className='lg:justify-self-center '
            target='_blank'
            rel='noopener noreferrer'
          >
            <span>Feature requests </span>
          </Link>
        </div>
        <div className='flex flex-col pb-8'>
          <h1 className='font-bold pb-2'>COMPANY</h1>
          <Link
            href={'https://www.openq.dev/'}
            className=' lg:justify-self-center'
            target='_blank'
            rel='noopener noreferrer'
          >
            <span>About</span>
          </Link>
          <Link href={'/terms-of-use'} className=' lg:justify-self-center' target='_blank' rel='noopener noreferrer'>
            <span>Terms of Use</span>
          </Link>
          <Link
            href={'https://www.openq.dev/privacy'}
            target='_blank'
            rel='noopener noreferrer'
            className=' lg:justify-self-center'
          >
            Privacy Policy
          </Link>
        </div>
        <div className='flex flex-col pb-8'>
          <h1 className='font-bold pb-2'>RESSOURCES</h1>
          <Link
            href={'https://docs.openq.dev'}
            className=' lg:justify-self-center'
            target='_blank'
            rel='noopener noreferrer'
          >
            <span>Documentation</span>
          </Link>
          <Link href={'/batch'} className=' lg:justify-self-center' target='_blank' rel='noopener noreferrer'>
            <span>Batch Mint</span>
          </Link>
        </div>
        <div className='flex flex-col sm:flex-row sm:justify-end gap-4'>
          <Image
            className='flex sm:items-start max-h-[24px]'
            src='/openq-logo-with-text.png'
            alt='OpenQ'
            width='90'
            height='90'
          />
          <div className='flex flex-col pb-8 w-56'>
            <div className='flex font-bold pb-2 sm:justify-end'>Made by devs for devs with</div>
            <div className='flex pb-2 sm:text-right'>❤️ in USA, Germany, Canada, Austria, Netherlands & Spain.</div>
            <div className='flex text-muted sm:text-right'>Contracts currently not audited, use at your own risk.</div>
          </div>
        </div>
      </div>
      <LoadingBar />
    </div>
  );
};

export default Footer;
