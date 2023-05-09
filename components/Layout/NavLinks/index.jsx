import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
const NavLinks = ({ setOpenMenu, appState }) => {
  const router = useRouter();
  const { accountData } = appState;
  return (
    <>
      <Link
        onClick={() => setOpenMenu(false)}
        href={'/'}
        className={`nav-link ml-1 $ ${router.asPath === '/' && 'text-white'}`}
      >
        <span> Explore</span>
      </Link>

      <Link
        onClick={() => setOpenMenu(false)}
        href={'/marketplace'}
        className={`nav-link $ ${router.asPath === '/marketplace' && 'text-white'}`}
      >
        <span>Marketplace</span>
      </Link>

      <Link
        onClick={() => setOpenMenu(false)}
        href={'/hackathons'}
        className={`nav-link $ ${router.asPath === '/hackathons' && 'text-white'}`}
      >
        <span> Hackathons</span>
      </Link>
      <Link
        onClick={() => setOpenMenu(false)}
        href={'/good-first-issues'}
        className={`nav-link $ ${router.asPath === '/good-first-issues' && 'text-white'}`}
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
