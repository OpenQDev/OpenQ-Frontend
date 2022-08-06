import React, { useContext } from 'react';

// Custom

import  ActionBubble from '../Utils/ActionBubble';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import BountyMetadata from './BountyMetadata.js';
import useWeb3 from '../../hooks/useWeb3';
import useEns from '../../hooks/useENS';


const BountyCardDetails = ({ bounty, setInternalMenu, justMinted }) => {
	const [appState] = useContext(StoreContext);
	const {account} = useWeb3();
	const [ensName] = useEns(bounty?.issuer?.id);
	const sender = ensName ||bounty?.issuer?.id;
	const [tokenValues] = useGetTokenValues(bounty.bountyTokenBalances||[]);
	const deposits = bounty.deposits ||[];
	const refunds = bounty.refunds || [];
	const title = sender|| justMinted ? `${ensName ||`${(sender||account).slice(0, 4)}...${(sender||account).slice(38)}`} minted this contract${sender ? ' '.concat(appState.utils.formatUnixDate(bounty.bountyMintTime)): ''}.`: 'Waiting for graph to index contract data.';
	const actions = appState.utils.mergeOrdered(deposits, refunds, 'receiveTime', 'refundTime');

	const addresses = deposits.reduce((accum, elem)=>{
		if(accum.includes(elem.sender.id)){
			return accum;}
		return [...accum, elem.sender.id];
	},[sender?.toLowerCase()||(justMinted && account)]);
	
	
	return (
		<div className='flex w-full px-2 sm:px-8 flex-wrap max-w-[1200px] pb-8 mx-auto'>
			<div className='flex-1 pr-4 min-w-[260px]'>
				<ActionBubble  addresses={addresses} address={sender} price={tokenValues?.total}  title = {title} bodyHTML={bounty.bodyHTML}/>
				{actions.map((action, index)=><ActionBubble address={action.sender?.id ||sender } key={index}  action={action} /> )}
		
			</div>
			<BountyMetadata bounty={bounty} setInternalMenu={setInternalMenu} price={tokenValues?.total}/>
		</div>

	);
};

export default BountyCardDetails;
