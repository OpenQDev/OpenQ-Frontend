// Third party
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@primer/octicons-react';
import { ethers } from 'ethers';
import Link from 'next/link';
import OpenQSocials from './OpenQSocials';

// Custom
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';

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
    <div className='flex justify-center justify-items-center full'>
      <div className='text-primary max-w- text-sm px-4 lg:px-20 max-w-[1120px] lg:py-12 py-4  xs:grid flex flex-col content-start items-start gap-4 xs:gap-y-0 lg:grid-cols-[0.5fr_1fr_1fr_1.5fr] grid-cols-[1fr_1fr]  lg:grid-rows-2 grid-rows-4 lg:grid-flow-col xs:items-center lg:flex-row w-full justify-between xs:content-center font-semibold grid-flow-row'>
        <div className='font-semibold font-sans text-3xl'>OpenQ</div>
        <OpenQSocials />
        <Link href={'https://openq.canny.io/openq-feature-requests'} className='text-lg lg:justify-self-center '>
          <span>Feature requests </span>
        </Link>
        <Link href={'https://docs.openq.dev'} className='text-lg lg:justify-self-center '>
          <span>Documentation</span>
        </Link>
        <div className='text-lg text-muted '>
          Copyright {year} <span className='whitespace-nowrap'>OpenQ ©</span>
        </div>
        {process.env.NEXT_PUBLIC_BUILD_NUMBER ? (
          <div className='text-muted '>Build: {process.env.NEXT_PUBLIC_BUILD_NUMBER}</div>
        ) : (
          <div></div>
        )}
        <div className='flex flex-wrap lg:gap-2 items-center justify-content-between text-muted w-full lg:w-fit text-right py-2 '>
          <div onClick={() => setOpen(!open)} className='min-w-[100px] flex gap-4 cursor-pointer'>
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
            <div className={`relative w-48 ${open && 'left-0.25 rounded-sm border bg-dark-mode border-web-gray'}`}>
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
        <span className='text-muted col-span-2 w-3/4'>Contracts currently not audited, use at your own risk.</span>
      </div>
    </div>
  );
};

export default Footer;
