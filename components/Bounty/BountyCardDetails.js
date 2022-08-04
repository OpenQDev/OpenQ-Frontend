import React, { useContext } from 'react';

// Custom

import  ActionBubble from '../Utils/ActionBubble';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import BountyMetadata from './BountyMetadata.js';
import useWeb3 from '../../hooks/useWeb3';


const BountyCardDetails = ({ bounty, setInternalMenu }) => {
	const [appState] = useContext(StoreContext);
	const {account} = useWeb3();
	const sender = bounty?.sender?.id || account;
	const [tokenValues] = useGetTokenValues(bounty.bountyTokenBalances||[]);
	const deposits = bounty.deposits ||[];
	const addresses = deposits.reduce((accum, elem)=>{
		if(accum.includes(elem.sender.id)){
			return accum;}
		return [...accum, elem.sender.id];
	},[sender?.toLowerCase()]);
	
	return (
		<div className='flex w-full px-2 sm:px-8 flex-wrap max-w-[1200px] pb-8 mx-auto'>
			{sender && <div className='flex-1 pr-4 min-w-[260px]'>
				{deposits.reverse().map((deposit, index)=><ActionBubble key={index} address={deposit.sender.id} deposit={deposit} title={`${(sender).slice(0, 4)}...${(sender).slice(38)} funded 3 Matic ($200 USD)`}/> )}
		
				<ActionBubble addresses={addresses} address={sender} price={tokenValues?.total}  title = {`${(sender).slice(0, 4)}...${(sender).slice(38)} minted this contract ${appState.utils.formatUnixDate(bounty.bountyMintTime)}.`} bodyHTML={bounty.bodyHTML}/>
			</div>}
			<BountyMetadata bounty={bounty} setInternalMenu={setInternalMenu} price={tokenValues?.total}/>
		</div>

	);
};

export default BountyCardDetails;
