// Third Party
import React from 'react';

// Custom
import BountyCardLean from '../../Bounty/BountyCardLean';

const Watching = ({watchedBounties, }) => {
	return (<div className='w-3/4 mx-auto'>
		{watchedBounties.length &&
									<div className='py-6 border-border-gray flex flex-wrap items-stretch w-full font-semibold text-lg'>
										{watchedBounties.map((bounty, index)=>
											<BountyCardLean unWatchable={true} key={index} bounty={bounty}/>)}
									</div>
		}
	</div>);

};

export default Watching;