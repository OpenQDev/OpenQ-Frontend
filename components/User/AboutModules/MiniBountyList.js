// Third Party
import React from 'react';

// Custom
import MiniBountyCard from './MiniBountyCard';

const MiniBountyList = ({bounties, type})=>{
	return (
		<div className='px-16 py-6 pb border-t border-web-gray'>
			<h2 className='font-semibold text-lg'>Bounties {type}</h2>
			<div>
				{bounties.length != 0 ?
					<ul>{bounties.map((bounty, index) => {

						return (
							<MiniBountyCard key={index} bounty={bounty} />
						);
					})
					}</ul> :
					<span className='pt-2'>No Bounties {type}</span>}
			</div>
		</div>);};
export default MiniBountyList;