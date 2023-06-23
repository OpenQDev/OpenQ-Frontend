import React from 'react';
import Link from 'next/link';
/* import { useRouter } from 'next/router'; */
const NavLinks = ({ setOpenMenu, appState }) => {
  /* const router = useRouter(); */
  const { accountData } = appState;
  return (
    <>
      <Link onClick={() => setOpenMenu(false)} href={'/'} className={`nav-link ml-1 text-white hover:text-gray-300 `}>
        <span> Explore</span>
      </Link>

      <Link
        onClick={() => setOpenMenu(false)}
        href={'/marketplace'}
        className={`nav-link text-white hover:text-gray-300`}
      >
        <span>Marketplace</span>
      </Link>

      <Link
        onClick={() => setOpenMenu(false)}
        href={'/hackathons'}
        className={`nav-link text-white hover:text-gray-300`}
      >
        <span> Hackathons</span>
      </Link>
      <Link
        onClick={() => setOpenMenu(false)}
        href={'/good-first-issues'}
        className={`nav-link text-white hover:text-gray-300`}
      >
        <span> Good First Issues</span>
      </Link>
      {!accountData.id && (
        <>
          <Link onClick={() => setOpenMenu(false)} href={'/login'} className={`nav-link md:hidden`}>
            <span> Login </span>
          </Link>
          <Link onClick={() => setOpenMenu(false)} href={'/login'} className={`nav-link md:hidden`}>
            <span>Sign up</span>
          </Link>
        </>
      )}
    </>
  );
};
export default NavLinks;
