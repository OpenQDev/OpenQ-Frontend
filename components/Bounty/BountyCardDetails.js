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
	const [senderEnsName] = useEns(bounty?.issuer?.id);
	const sender = senderEnsName ||bounty?.issuer?.id;
	const [tokenValues] = useGetTokenValues(bounty.bountyTokenBalances);
	
	
	const deposits = bounty.deposits ||[];
	const refunds = bounty.refunds || [];
	const title = sender|| justMinted ? `${senderEnsName ||`${(sender||account).slice(0, 4)}...${(sender||account).slice(38)}`} minted this contract on ${sender ? ' '.concat(appState.utils.formatUnixDate(bounty.bountyMintTime)): ''}.`: 'Waiting for graph to index contract data.';
	let claimedEvent = [];
	let closedEvents = [];
	if(bounty.bountyClosedTime && bounty.status){
		closedEvents = [{time:bounty.bountyClosedTime }];
	}
	if(bounty.claims.length){
	
		claimedEvent=bounty.claims;
		
	}
	const depositsAndRefunds = appState.utils.mergeOrdered( deposits, refunds, 'receiveTime', 'refundTime');
	const normalizedDepositsAndRefunds = depositsAndRefunds.map((action)=>{
		const time = action.receiveTime || action.refundTime;
		return {...action, time};
	});
	const claimsAndCloses = appState.utils.mergeOrdered( closedEvents, claimedEvent,  'time', 'claimTime');
	const normalizedClaimsAndCloses = claimsAndCloses.map((action)=>{
		const closingTime = action.claimTime || action.time;
		return {...action, closingTime};
	});
	const allActions = appState.utils.mergeOrdered( normalizedClaimsAndCloses, normalizedDepositsAndRefunds, 'closingTime', 'time');
	
	const addresses = deposits.reduce((accum, elem)=>{
		if(accum.includes(elem.sender.id)){
			return accum;}
		return [...accum, elem.sender.id];
	},[sender?.toLowerCase()||(justMinted && account)]);
	
	
	return (
		<div className='flex w-full px-2 sm:px-8 flex-wrap max-w-[1200px] pb-8 mx-auto'>
			<div className='flex-1 pr-4 min-w-[260px]'>
				<ActionBubble  addresses={addresses} address={sender} price={tokenValues?.total} bounty={bounty}  title = {title} bodyHTML={bounty.bodyHTML}/>
				{allActions.map((action, index)=><ActionBubble address={action.sender?.id ||action.claimant?.id||sender } key={index} bounty={bounty} action={action} /> )}
		
			</div>
			<BountyMetadata bounty={bounty} setInternalMenu={setInternalMenu} price={tokenValues?.total}/>
		</div>

	);
};

export default BountyCardDetails;
