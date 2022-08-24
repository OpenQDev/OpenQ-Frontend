import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
const NavLinks = ()=>{
	const router = useRouter();
	return ( <>
	
		<Link href={'/'}>
			<a className={`nav-link $ ${router.asPath === '/' && 'text-white'}`}>
							Explore
			</a>
		</Link>

		<Link href={'/prime'}>
			<a className={`nav-link $ ${router.asPath === '/prime' && 'text-white'}`}>
								Prime
			</a>
		</Link>
						
		<Link href={'/contests'}>
			<a className={`nav-link $ ${router.asPath === '/contests' && 'text-white'}`}>
							Contests
			</a>
		</Link>

		<Link href={'/learn2earn'}>
			<a className={`nav-link $ ${router.asPath === '/learn2earn' && 'text-white'}`}>

							Learn2Earn
			</a>
		</Link>
						
	</>
	);
};
export default NavLinks;