// Third party
import React, { useEffect, useRef, useContext } from 'react';
import Image from 'next/legacy/image';
import Link from 'next/link';
// Custom
import StoreContext from '../../store/Store/StoreContext';

const Sidebar = ({ trigger, setTrigger }) => {
  let menuRef = useRef();
  const [appState] = useContext(StoreContext);
  useEffect(() => {
    if (trigger) {
      let handler = (event) => {
        if (!menuRef.current.contains(event.target)) {
          setTrigger(false);
        }
      };

      window.addEventListener('mousedown', handler);

      return () => {
        window.removeEventListener('mousedown', handler);
      };
    }
  });

  return (
    /* Sidebar
		
				This sidebar is hidden via tailwind classes. 
				absolute inset-y-0 left-0 transform -translate-x-full sm:relative sm:translate-x-0 transition duration-200 ease-in-out
				*/
    <div className={` ${!trigger ? 'invisible' : ''} md:visible`}>
      <div className='flex fixed top-0'>
        <div ref={menuRef} className='bg-dark-mode w-20 flex min-h-screen flex-col border-r border-web-gray'>
          <nav className=' flex flex-col space-y-4 items-center pt-1 flex-grow'>
            <div className='pb-8 pt-5 cursor-pointer'>
              {appState.needsReload ? (
                <a href='/'>
                  <Image src='/openq-logo.png' alt='OpenQ' width='31' height='31' />
                </a>
              ) : (
                <Link href={'/'} legacyBehavior>
                  <Image src='/openq-logo.png' alt='OpenQ' width='31' height='31' />
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
