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

      <Link href={'/contests'} className={`nav-link $ ${router.asPath === '/contests' && 'text-white'}`}>
        <span> Contests</span>
      </Link>

      <Link href={'/non-profit'} className={`nav-link $ ${router.asPath === '/non-profit' && 'text-white'}`}>
        <span> Non-Profit</span>
      </Link>
    </>
  );
};
export default NavLinks;
