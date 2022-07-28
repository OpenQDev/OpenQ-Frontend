import React from 'react';
import Image from 'next/image';

const OrganizationHeader = ({organizationData})=>{

	return (
		<div className='px-4 pt-3 flex flex-wrap gap-6 w-full '>
			<div className='hidden sm:block'>
				<Image width={100} height={100} className="bg-active-gray rounded-sm  w-20 h-20" src="https://avatars.githubusercontent.com/u/77402538?s=200&v=4"/>
			</div>
			<div className='flex-1 self-center'>
				<h1 className='text-2xl leading-condensed font-semibold'>{organizationData.name || organizationData.login}</h1>
				<p className='text-sm text-muted leading-[21px]'><span>{organizationData?.description|| ''}</span></p>
				<ul className='inline-block text-sm mt-2'>
					<li className='inline-block'>
						<div className='flex gap-1 mx-1'>

							<svg aria-hidden="true" height="16" viewBox="0 0 16 16" className="fill-primary" version="1.1" width="16" data-view-component="true">
								<path fillRule="evenodd" d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"></path>
							</svg>
							<span  className='text-xs'>GitHub</span>
                
						</div>
					</li>
						
					<li className='inline-block'>
						<div className='flex gap-1 mx-1'>

							<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="fill-primary">
								<path fillRule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path>
							</svg>
							<span  className='text-xs'>{organizationData.websiteUrl}</span>
						</div>
					</li>
					<li className='inline-block'>
						<div className='flex gap-1 mx-1'>

								
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 273.5 222.3" role="img" aria-labelledby="lzb78i9oiue5l6m8i5dzjc7743au9j8" className="fill-primary" height="16" width="16"><title id="lzb78i9oiue5l6m8i5dzjc7743au9j8">Twitter</title><path d="M273.5 26.3a109.77 109.77 0 0 1-32.2 8.8 56.07 56.07 0 0 0 24.7-31 113.39 113.39 0 0 1-35.7 13.6 56.1 56.1 0 0 0-97 38.4 54 54 0 0 0 1.5 12.8A159.68 159.68 0 0 1 19.1 10.3a56.12 56.12 0 0 0 17.4 74.9 56.06 56.06 0 0 1-25.4-7v.7a56.11 56.11 0 0 0 45 55 55.65 55.65 0 0 1-14.8 2 62.39 62.39 0 0 1-10.6-1 56.24 56.24 0 0 0 52.4 39 112.87 112.87 0 0 1-69.7 24 119 119 0 0 1-13.4-.8 158.83 158.83 0 0 0 86 25.2c103.2 0 159.6-85.5 159.6-159.6 0-2.4-.1-4.9-.2-7.3a114.25 114.25 0 0 0 28.1-29.1" fill="currentColor"></path></svg>

							<a rel="nofollow" itemProp="url" className="text-xs" title="openqlabs" href="https://twitter.com/openqlabs">@openqlabs</a>
                
							
						</div>
					</li>
					<li className='inline-block'>
						<div className='flex gap-1 mx-1'>

								
							<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"  className="fill-primary">
								<path fillRule="evenodd" d="M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zm-13 1.74v6.441c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809z"></path>
							</svg>
							<a rel="nofollow" itemProp="url" className="text-xs" title="openqlabs" href="https://twitter.com/openqlabs">info@openq.dev</a>
                
							
						</div>
					</li>
						
				</ul>
			</div>
		</div>
	);
};

export default OrganizationHeader;