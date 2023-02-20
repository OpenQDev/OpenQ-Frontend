import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
const NavLinks = () => {
  const router = useRouter();
  return (
    <>
      <Link href={'/'} className={`nav-link ml-1 $ ${router.asPath === '/' && 'text-white'}`}>
        <span> Explore</span>
      </Link>

      <Link href={'/marketplace'} className={`nav-link $ ${router.asPath === '/marketplace' && 'text-white'}`}>
        <span>Marketplace</span>
      </Link>

      <Link href={'/hackathons'} className={`nav-link $ ${router.asPath === '/hackathons' && 'text-white'}`}>
        <span> Hackathons</span>
      </Link>
      <Link
        href={'/good-first-issues'}
        className={`nav-link $ ${router.asPath === '/good-first-issues' && 'text-white'}`}
      >
        <span> Good First Issues</span>
      </Link>
    </>
  );
};
export default NavLinks;
