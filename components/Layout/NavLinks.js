import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
const NavLinks = ()=>{
	const router = useRouter();
	return ( <>
		<Link href={'/atomic-contracts'}>
			<a className={`nav-link $ ${router.asPath === '/atomic-contracts' && 'text-white'}`}>
								Atomic contracts
			</a>
		</Link>
						
		<Link href={'/contests'}>
			<a className={`nav-link $ ${router.asPath === '/contests' && 'text-white'}`}>
							Contests
			</a>
		</Link>

		<Link href={'/repeatable'}>
			<a className={`nav-link $ ${router.asPath === '/repeatable' && 'text-white'}`}>

							Repeatable
			</a>
		</Link>
						
		<Link href={'/organizations'}>
			<a className={`nav-link $ ${router.asPath === '/organizations' && 'text-white'}`}>

							Organizations
			</a>
		</Link>
						
		<Link href={'/'}>
			<a className={`nav-link $ ${router.asPath === '/' && 'text-white'}`}>
							Explore
			</a>
		</Link>
	</>
	);
};
export default NavLinks;