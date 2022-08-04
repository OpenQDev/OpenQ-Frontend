import React, { useContext } from 'react';

// Custom

import  ActionBubble from '../Utils/ActionBubble';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import BountyMetadata from './BountyMetadata.js';


const BountyCardDetails = ({ bounty, setInternalMenu }) => {
	const [appState] = useContext(StoreContext);


	const [tokenValues] = useGetTokenValues(bounty.bountyTokenBalances||[]);
	const addresses = bounty.deposits.reduce((accum, elem)=>{
		if(accum.includes(elem.sender.id)){
			return accum;}
		return [...accum, elem.sender.id];
	},[bounty.issuer.id]);
	
	return (
		<div className='flex w-full px-2 sm:px-8 flex-wrap max-w-[1200px] pb-8 mx-auto'>
			<div className='flex-1 pr-4 min-w-[260px]'>
				{bounty.deposits.reverse().map((deposit, index)=><ActionBubble key={index} address={deposit.sender.id} deposit={deposit} title={`${(bounty.issuer.id).slice(0, 4)}...${(bounty.issuer.id).slice(38)} funded 3 Matic ($200 USD)`}/> )}
		
				<ActionBubble addresses={addresses} address={bounty.issuer.id} price={tokenValues?.total}  title = {`${(bounty.issuer.id).slice(0, 4)}...${(bounty.issuer.id).slice(38)} minted this contract ${appState.utils.formatUnixDate(bounty.bountyMintTime)}.`} bodyHTML={bounty.bodyHTML}/>
			</div>
			<BountyMetadata bounty={bounty} setInternalMenu={setInternalMenu} price={tokenValues?.total}/>
		</div>

	);
};

export default BountyCardDetails;
