// Third Party
import React from 'react';
import Image from 'next/image';

const LargeOrganizationCard = ({ organization }) => {

	const orgName =
		organization.name.charAt(0).toUpperCase() + organization.name.slice(1);

	// Render
	return (
		<div className='w-min justify-self-end invisible md:visible'>
			<div
				className={
					'flex flex-col p-10 items-center font-mont rounded-lg shadow-sm border border-web-gray pr-11 pl-11'
				}
			>
				<div className="w-24 h-24 relative">
					<Image src={organization.avatarUrl} alt="n/a" layout="fill" />
				</div>
				<div className="pt-5 text-center font-semibold text-white">
					{orgName}
				</div>
			</div>
		</div>
	);
};

export default LargeOrganizationCard;
