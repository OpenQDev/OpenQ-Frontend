// Third Party
import React from 'react';

// Custom
import OrganizationCard from '../../Organization/OrganizationCard';

const Starred = ({starredOrganizations, }) => {

	return(<div className='sm:w-3/4 mx-auto'>
		{starredOrganizations.length > 0 &&
									<div className='py-6 border-border-gray flex gap-4 flex-wrap justify-center sm:justify-start items-stretch w-full font-semibold text-lg'>
										{starredOrganizations.map((bounty, index)=>
											<OrganizationCard key={index} organization={bounty}/>)}
									</div>
		}
	</div>);

};

export default Starred;