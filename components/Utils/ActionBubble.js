import React, { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import StoreContext from '../../store/Store/StoreContext';
import useEns from '../../hooks/useENS';
import { ethers } from 'ethers';
import Jazzicon from './Jazzicon';
import useWeb3 from '../../hooks/useWeb3';


const ActionBubble = ({ addresses, bounty, action,})=>{
	
	const [appState] = useContext(StoreContext);
	const [justMinted, setJustMinted] = useState(false);
	const {body, bodyHTML} = bounty;
	const [senderEnsName] = useEns(action?.sender?.id);
	const [minterEnsName] = useEns(bounty?.issuer?.id);
	const [claimantEnsName] = useEns( action?.claimant?.id);
	const [tokenValues ] = useGetTokenValues((action?.receiveTime || action?.refundTime) && action);
	const {account } = useWeb3();
	
	useEffect(()=>{
		const justMinted = sessionStorage.getItem('justMinted');
		if(justMinted){setJustMinted(true);}
	},[]);

	const shortenAddress = (address)=>{
		if(!address){
			return '';}
		return `${address.slice(0, 4)}...${address.slice(38)}`;
	};
	const minter = minterEnsName ||(bounty.issuer && shortenAddress(bounty.issuer.id));

	
	let	title = `${minter} minted this contract on ${appState.utils.formatUnixDate(bounty.bountyMintTime)}.`;
	let address = bounty.issuer?.id;
	if(!action && !minter){
		if(justMinted){
		
			title=`${account} minted this contract on ${appState.utils.formatUnixDate(Date.now()/1000)}.`;
		}
		else{
			title='Waiting for this contract to be indexed by the Graph.';}
	}
	
	if(action?.claimTime){
		const claimant = claimantEnsName ||shortenAddress(action.claimant.id);
		address = action.claimant.id;
		if(bounty.bountyType==='3'){
			title = `${claimant} claimed this contract on ${appState.utils.formatUnixDate(action.claimTime)}.`;
		}
		if(bounty.bountyType==='1'){
			title = `${claimant} made a claim on this contract on ${appState.utils.formatUnixDate(action.claimTime)}.`;
		}
	}

	if(action?.closingTime){
		title = `${minter} closed this contract on ${appState.utils.formatUnixDate(action.closingTime)}.`;
	
	}
	
	
	if(action?.receiveTime||action?.refundTime){
		const funder = senderEnsName ||shortenAddress(bounty.issuer.id);
		address = bounty.issuer.id;
		const { volume } = action;
		const tokenMetadata = appState.tokenClient.getToken(action.tokenAddress);
		let bigNumberVolume = ethers.BigNumber.from(volume.toString());
		let decimals = parseInt(tokenMetadata.decimals)||18;
		let formattedVolume = ethers.utils.formatUnits(bigNumberVolume, decimals);
		if( action.receiveTime){
			title = `${funder} funded this contract with ${formattedVolume} ${tokenMetadata.symbol} (${appState.utils.formatter.format (tokenValues?.total)}) on ${appState.utils.formatUnixDate(action.receiveTime)}.`;
		}
		if( action.refundTime){
			title = `${funder} refunded a deposit of ${formattedVolume} ${tokenMetadata.symbol} (${appState.utils.formatter.format (tokenValues?.total)}) on ${appState.utils.formatUnixDate(action.refundTime)}.`;
		}
	}
	return (
		<div className='w-full pt-4 flex relative'>
			{action  ? 
				<Jazzicon styles={'w-fit'} size={36} address={address} /> :
				<div className='relative w-9'>
					{addresses.reverse().map((address, index)=>{						
						return 	<div key={index} className={`h-4 w-10 z-${30-index*10} bg-transparent cursor-pointer relative hover:z-40`}>
							
							<div className='border-2 bg-dark-mode border-dark-mode hover:border-pink-500 rounded-lg h-10 w-10'><Jazzicon styles={'w-min'}  key={index} size={36} address={address} />
							</div>
						</div>;
					})}
				</div>
			}
			<div className='w-full flex-0 rounded-sm overflow-hidden ml-4 border-web-gray border-b before:w-2 before:h-2 before:bg-nav-bg before:absolute before:absolute before:left-12 before:top-[35px] before:border-b  before:border-l before:border-web-gray before:top-10 before:rotate-45  border'>
				
				<div className={`bg-nav-bg w-full pl-3 ${(body || bodyHTML) && 'border-web-gray border-b'} flex justify-between`}>
					<span className='py-2'>{tokenValues || (!action?.receiveTime && !action?.refundTime) ? title : <Skeleton width="34" />}</span>
					{action?.refunded && <span className='border rounded-full border-web-gray px-2 py-px m-1'> Refunded</span>}
				</div>
				{bodyHTML&&<div className='w-full p-8 p-4 markdown-body' dangerouslySetInnerHTML={{__html: bodyHTML }}></div>
				}
			</div>
			
		</div>);
};
export default ActionBubble;