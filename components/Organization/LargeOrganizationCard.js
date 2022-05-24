// Third party
import React from 'react';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';

const LargeOrganizationCard = ({ organization }) => {

	let orgName;
	if (organization?.__typename === 'Organization') {
		orgName = organization?.name.charAt(0).toUpperCase() + organization?.name.slice(1);
	} else {
		orgName = organization?.login.charAt(0).toUpperCase() + organization?.login.slice(1);
	}

	// Render
	return (
		<div className='w-min justify-self-end hidden 2xl:block mr-8'>
			<div
				className={
					'flex flex-col p-10 items-center font-mont rounded-lg shadow-sm border border-web-gray pr-11 pl-11'
				}
			>
				<div className="w-24 h-24 relative">
					{organization?.avatarUrl ?
						<Image className='rounded-full' src={organization.avatarUrl} alt="n/a" layout="fill" priority={true} /> :
						<Skeleton baseColor="#333" borderRadius={'1rem'} height={'96px'} />}
				</div>
				<div className="pt-5 text-center font-semibold ">
					{orgName ?
						orgName :
						<Skeleton baseColor="#333" borderRadius={'1rem'} height={'12px'} width={'96px'} />
					}
				</div>
			</div>
		</div>
	);
};

export default LargeOrganizationCard;
