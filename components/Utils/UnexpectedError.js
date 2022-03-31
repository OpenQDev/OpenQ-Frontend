import React from 'react';
import Link from 'next/link';

const UnexpectedError = ()=>{
	return (<div className="absolute inset-0 flex text-lg text-white justify-center content-center items-center sm:bg-overlay bg-dark-mode">
		<div className="w-full p-4 max-w-md rounded-lg bg-dark-mode w-full space-y-2">
			<h1 className="text-3xl mb-4">Oops, something wrong.</h1>
			<p>Sorry, something went wrong. There was an error fetching data for your page.</p>
			<p>{'Either OpenQ couldn\'t find your bounty or Github didn\'t respond.'}</p>
			<p className='flex w-full justify-between'>
				<span className="underline"><Link href={'/'}>Go home</Link></span>
				<span className="underline"><Link href={'https://www.githubstatus.com/'}>Check Github Status</Link>.
				</span></p>
		</div>
	</div>);
};
export default UnexpectedError;