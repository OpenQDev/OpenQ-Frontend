// Third Party
import React from 'react';
import Link from 'next/link';

// Custom

const OrganizationCard = (props) => {
	const { organization } = props;

	// Context

	// Methods

	// Render
	return (
		<>
			<Link href={`/organization/${organization.login}`}>
				<div
					className={
						'flex flex-col p-6 font-mont rounded-xl shadow-sm bg-white cursor-pointer pr-10 pl-10'
					}
				>
					<div>
						Name: {organization.name}
					</div>
					<div>
						Description: {organization.description}
					</div>
					<div>
						OpenBounties: {organization.bountiesCreated.map(bounty => bounty.status == 'OPEN').length}
					</div>
				</div>
			</Link>
		</>
	);
};

export default OrganizationCard;
