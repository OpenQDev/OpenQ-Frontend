import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
const NavLinks = () => {
  const router = useRouter();
  return (
    <>
      <Link href={'/'} className={`nav-link $ ${router.asPath === '/' && 'text-white'}`}>
        Explore
      </Link>

      <Link href={'/fixed-price'} className={`nav-link $ ${router.asPath === '/fixed-price' && 'text-white'}`}>
        Fixed Price
      </Link>
      <Link href={'/split-price'} className={`nav-link $ ${router.asPath === '/split-price' && 'text-white'}`}>
        Split Price
      </Link>

      <Link href={'/contests'} className={`nav-link $ ${router.asPath === '/contests' && 'text-white'}`}>
        Contests
      </Link>

      <Link href={'/non-profit'} className={`nav-link $ ${router.asPath === '/non-profit' && 'text-white'}`}>
        Non-Profit
      </Link>
    </>
  );
};
export default NavLinks;
