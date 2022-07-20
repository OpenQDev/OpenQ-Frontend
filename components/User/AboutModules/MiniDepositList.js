// 
import React from 'react';

// Custom
import MiniDepositCard from '../../Bounty/MiniDepositCard';

const MiniDepositList = ({deposits})=>{

	return	<div className='px-10 py-5 border-t pb border-web-gray'>
		<h2 className='font-bold uppercase text-gray-300 text-xl px-6'>Deposits</h2>

		{deposits.length > 0 ?
			<ul className="flex flex-wrap justify-between gap-5 pt-2">{deposits.map((deposit) =>
				<MiniDepositCard key={deposit.id} showLink={true} deposit={deposit} />
			)}</ul> :

			<div className='px-6 pt-2'>No Deposits</div>}

	</div>;
};

export default MiniDepositList;