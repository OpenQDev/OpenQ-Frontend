import React from 'react';
import Link from 'next/link';

const GithubDown = ()=>{
	return (<div className="absolute inset-0 flex text-lg text-white justify-center content-center items-center sm:bg-black/30 bg-dark-mode">
		<div className="w-full p-4 max-w-md rounded-lg bg-dark-mode text-center">
			<h1 className="text-3xl mb-4">Cannot connect to GitHub.</h1>
			<div>Please check <span className="underline"><Link href={'https://www.githubstatus.com/'}>githubstatus.com</Link>.
			</span> 
			{' '}Note than it can take up to 15 minutes for GitHub to update their status page.</div>
		</div>
	</div>);
};
export default GithubDown;