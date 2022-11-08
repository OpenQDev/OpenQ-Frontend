import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
const NavLinks = () => {
  const router = useRouter();
  return (
    <>
      <Link href={'/'} className={`nav-link $ ${router.asPath === '/' && 'text-white'}`}>
        <span> Explore</span>
      </Link>

      <Link href={'/fixed-price'} className={`nav-link $ ${router.asPath === '/fixed-price' && 'text-white'}`}>
        <span> Fixed Price</span>
      </Link>
      <Link href={'/split-price'} className={`nav-link $ ${router.asPath === '/split-price' && 'text-white'}`}>
        <span> Split Price</span>
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
