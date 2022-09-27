// Third party
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@primer/octicons-react';
import { ethers } from 'ethers';

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
    <div className='text-primary text-sm w-full bg-nav-bg py-2 flex flex-col lg:flex-row w-full justify-between content-center font-semibold text-muted'>
      <div className='flex-row lg:flex flex-wrap lg:flex-nowrap justify-between items-center justify-between w-full lg:px-12 px-4'>
        <div className='flex-0 border-web-gray lg:border-none border-b py-2'>Copyright {year} OpenQ ©</div>
        {process.env.NEXT_PUBLIC_BUILD_NUMBER ? <div>Build: {process.env.NEXT_PUBLIC_BUILD_NUMBER}</div> : <></>}

        <div className='border-web-gray lg:border-none border-b py-2'>
          Contracts currently not audited, please use at your own risk.
        </div>
        <div className='flex flex-wrap gap-6 items-center justify-content-between w-full lg:w-fit text-right py-2 pr-32'>
          <div onClick={() => setOpen(!open)} className='min-w-[100px] flex gap-4 cursor-pointer'>
            <span> Smart Contracts</span>
            {open ? (
              <span>
                <ChevronDownIcon />
              </span>
            ) : (
              <span onClick={() => setOpen(!open)}>
                <ChevronUpIcon />
              </span>
            )}
          </div>
          <div className='relative h-6'>
            <div className={`relative w-36 ${open && 'bottom-14 p-2 bg-nav-bg rounded-sm border border-web-gray'}`}>
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
      </div>
    </div>
  );
};

export default Footer;
