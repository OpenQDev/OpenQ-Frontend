import React, { useContext } from 'react';

// Custom

import  ActionBubble from '../Utils/ActionBubble';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import BountyMetadata from './BountyMetadata.js';
import useWeb3 from '../../hooks/useWeb3';
import useEns from '../../hooks/useENS';


const BountyCardDetails = ({ bounty, setInternalMenu }) => {
	const [appState] = useContext(StoreContext);
	const {account} = useWeb3();
	const [ensName] = useEns(bounty?.issuer?.id || account);
	const sender = ensName ||bounty?.issuer?.id || account;
	const [tokenValues] = useGetTokenValues(bounty.bountyTokenBalances||[]);
	const deposits = bounty.deposits ||[];
	const refunds = bounty.refunds || [];

	const actions = appState.utils.mergeOrdered(deposits, refunds, 'receiveTime', 'refundTime');

	const addresses = deposits.reduce((accum, elem)=>{
		if(accum.includes(elem.sender.id)){
			return accum;}
		return [...accum, elem.sender.id];
	},[sender?.toLowerCase()]);
	
	
	return (
		<div className='flex w-full px-2 sm:px-8 flex-wrap max-w-[1200px] pb-8 mx-auto'>
			{sender && <div className='flex-1 pr-4 min-w-[260px]'>
				<ActionBubble addresses={addresses} address={sender} price={tokenValues?.total}  title = {`${ensName ||`${(sender).slice(0, 4)}...${(sender).slice(38)}`} minted this contract ${appState.utils.formatUnixDate(bounty.bountyMintTime)}.`} bodyHTML={bounty.bodyHTML}/>
				{actions.map((action, index)=><ActionBubble address={action.sender?.id ||sender } key={index}  action={action} /> )}
		
			</div>}
			<BountyMetadata bounty={bounty} setInternalMenu={setInternalMenu} price={tokenValues?.total}/>
		</div>

	);
};

export default BountyCardDetails;
