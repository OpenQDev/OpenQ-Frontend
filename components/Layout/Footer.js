// Third party
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@primer/octicons-react';
import { ethers } from 'ethers';
import Link from 'next/link';
import OpenQSocials from './OpenQSocials';

// Custom
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';

const Footer = () => {
  const year = new Date().getFullYear();
  const [toggle, setToggle] = useState(1);
  const [open, setOpen] = useState();
  const modal = useRef();

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
      <div className='text-primary max-w- text-sm w-full px-4 md:px-20 max-w-[1120px] md:py-12 py-4  grid gap-x-4 md:grid-cols-[0.5fr_1.5fr_1fr] grid-cols-[1fr_1fr]  md:grid-rows-2 grid-rows-4 grid-flow-col items-center lg:flex-row w-full justify-between content-center font-semibold'>
        <div className='font-semibold font-sans text-3xl'>OpenQ</div>
        <OpenQSocials />
        <Link href={'/'}>
          <a className='text-lg justify-self-start'>Feature requests</a>
        </Link>
        <Link href={'/'}>
          <a className='text-lg'>Documentation</a>
        </Link>
        <div className='flex flex-wrap gap-2 items-center justify-content-between text-muted w-full lg:w-fit text-right py-2 col-start-1 row-start-3  md:col-start-auto md:row-start-auto'>
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
            <div className={`relative w-48 ${open && 'left-0.25 rounded-sm border border-web-gray'}`}>
              {open ? (
                <div ref={modal}>
                  <button onClick={() => setToggle(1)} value={1} className='block'>
                    <CopyAddressToClipboard
                      clipping={[5, 38]}
                      data={process.env.NEXT_PUBLIC_OPENQ_PROXY_ADDRESS}
                      styles='pt-0 w-64'
                    />
                  </button>

                  <button onClick={() => setToggle(2)} value={2} className='block'>
                    <CopyAddressToClipboard
                      clipping={[5, 38]}
                      data={process.env.NEXT_PUBLIC_DEPOSIT_MANAGER_PROXY_ADDRESS}
                      styles='pt-0 w-64'
                    />
                  </button>
                  <button onClick={() => setToggle(3)} value={3} className='block'>
                    <CopyAddressToClipboard
                      clipping={[5, 38]}
                      data={process.env.NEXT_PUBLIC_CLAIM_MANAGER_PROXY_ADDRESS}
                      styles='pt-0 w-64'
                    />
                  </button>
                </div>
              ) : toggle === 1 ? (
                <button value={1} className='block'>
                  <CopyAddressToClipboard
                    clipping={[5, 38]}
                    data={process.env.NEXT_PUBLIC_OPENQ_PROXY_ADDRESS}
                    styles='pt-0 w-64'
                  />
                </button>
              ) : toggle === 2 ? (
                <button value={2} className='block'>
                  <CopyAddressToClipboard
                    clipping={[5, 38]}
                    data={process.env.NEXT_PUBLIC_DEPOSIT_MANAGER_PROXY_ADDRESS}
                    styles='pt-0 w-64'
                  />
                </button>
              ) : (
                <button value={3} className='block'>
                  <CopyAddressToClipboard
                    clipping={[5, 38]}
                    data={ethers.utils.getAddress(process.env.NEXT_PUBLIC_CLAIM_MANAGER_PROXY_ADDRESS || '')}
                    styles='pt-0 w-64'
                  />
                </button>
              )}
            </div>
          </div>
        </div>
        <span className='text-muted col-start-1 col-span-2 w-3/4 row-start-4 md:col-start-auto md:row-start-auto'>
          Contracts currently not audited, use at your own risk.
        </span>
      </div>
    </div>
  );
};

export default Footer;
