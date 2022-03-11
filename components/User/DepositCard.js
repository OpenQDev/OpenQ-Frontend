// Third Party
import React, { useContext } from 'react';
import Link from 'next/link';


import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import TokenBalances from '../TokenBalances/TokenBalances';
const DepositCard = ({ deposit }) => {
	// Context
	const [appState] = useContext(StoreContext);

	// State
	const [tokenValues] = useGetTokenValues(deposit);

	return (
		<div className= "border-web-gray border rounded-lg px-6 py-2 my-4" >
			<div>Bounty: <span className="underline"><Link href={`/bounty/${deposit.bounty.id}`}>{`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${deposit.bounty.id}`}</Link></span></div>
			<div>Bounty Id: {deposit.bounty.bountyId}</div>
			<div>Contract Address: {deposit.tokenAddress}</div>
			<TokenBalances 
				tokenBalances={deposit}
				tokenValues={tokenValues} />
		</div>
		
	);
};

export default DepositCard;
