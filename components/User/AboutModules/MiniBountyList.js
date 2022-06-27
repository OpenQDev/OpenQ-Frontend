// Third Party
import React from 'react';

// Custom
import MiniBountyCard from './MiniBountyCard';

const MiniBountyList = ({bounties, type})=>{
	return (
		<div className='px-10 py-10 pb border-t border-web-gray'>
			<h2 className='font-bold uppercase text-gray-300 text-xl px-6'>Bounties {type}</h2>
			<div>
				{bounties.length != 0 ?
					<ul>{bounties.map((bounty, index) => {

						return (
							<MiniBountyCard key={index} bounty={bounty} />
						);
					})
					}</ul> :
					<span className='px-6 pt-2'>No Bounties {type}</span>}
			</div>
		</div>);};
export default MiniBountyList;