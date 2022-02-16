// Third Party
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LargeOrganizationCard = ({ organization }) => {
	// Context
	const orgName =
    organization.name.charAt(0).toUpperCase() + organization.name.slice(1);

	// Methods

	// Render
	return (
		<div className='w-min justify-self-end'>
			<Link href={`/organization/${organization.login}`}>
				<div
					className={
						'flex flex-col p-10 items-center font-mont rounded-xl shadow-sm border border-web-gray cursor-pointer pr-11 pl-11'
					}
				>
					<div className="w-24 h-24 relative">
						<Image src={organization.avatarUrl} alt="n/a" layout="fill" />
					</div>
					<div className="pt-5 text-center font-semibold text-white">
						{orgName}
					</div>
					
				</div>
			</Link>
		</div>
	);
};

export default LargeOrganizationCard;
