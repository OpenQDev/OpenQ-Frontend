import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

const GetSupportModal = ({ wizardVisibility, modalVisibility }) => {
  // Refs
  const modal = useRef();

  useEffect(() => {
    // Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    function handleClickOutside(event) {
      if (modal.current && !modal.current.contains(event.target)) {
        modalVisibility(false);
        wizardVisibility(false);
      }
    }
    // Bind the event listener
    {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modal]);

  return (
    <>
      <div
        className={
          'flex justify-center items-start sm:items-center mx-4 overflow-x-hidden overflow-y-auto fixed inset-0 outline-none z-50 focus:outline-none p-10'
        }
      >
        <div ref={modal} className='m-auto w-3/5 min-w-[320px] max-w-screen-sm z-50 fixed top-40'>
          <div className='w-full rounded-sm flex flex-col bg-[#161B22] z-11 space-y-1 md:h-96'>
            <div className='max-h-[70vh] w-full overflow-y-auto'>
              <div className='flex flex-col items-center justify-center p-5 pb-8 rounded-t space-y-4'>
                <h3 className='text-3xl text-center font-semibold'>We didn't find a suitable contract</h3>
                <h3 className='text-lg pt-8 pb-8  w-5/6 text-center text-gray-300'>
                  Don't worry, you can help us and describe more precisely what kind of contract you want. If we don't
                  have this one yet, we'll be happy to get to it next. Join our Discord and write us in the support
                  channel or send us an email at riccardo@openq.dev
                </h3>
                <Link href={'https://discord.gg/puQVqEvVXn'}>
                  <a className='flex items-center gap-4 text-lg' target={'_blank'} rel='noopener noreferrer'>
                    <Image src={'/social-icons/discord.svg'} width={34} height={34} />
                    <p>Get Help!</p>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-overlay fixed inset-0 z-10'></div>
      </div>
    </>
  );
};

export default GetSupportModal;
