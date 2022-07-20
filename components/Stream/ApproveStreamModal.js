// Third party
import React, { useRef, useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';

// Custom
import {
	CONFIRM,
	APPROVING,
	TRANSFERRING,
	SUCCESS,
	ERROR
} from '../FundBounty/ApproveTransferState';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import Image from 'next/image';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';
import TokenSearch from '../FundBounty/SearchTokens/TokenSearch';
import StoreContext from '../../store/Store/StoreContext';
import ToolTip from '../Utils/ToolTip';

const ApproveStreamModal = ({
	transactionHash,
	setShowApproveTransferModal,
	approveTransferState,
	resetState,
	error,
	confirmationMessage,
	confirmMethod,
	approvingMessage,
	approvingTitle,
	token,
	bountyAddress,
	bounty,
	deleteFlow,
	showModal
}) => {
	console.log(approveTransferState);
	const modal = useRef();
	const [recipient, setRecipient] = useState('');
	const [flowRate, setFlowRate] = useState('');
	const [appState] = useContext(StoreContext);
	const [localToken, setLocalToken] = useState({name: 'Daix',
		address: '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f',
		symbol: 'DAI',
		decimals: 18,
		chainId: 80001,
		path: '/crypto-logos/DAI.svg'});
	const updateModal = () => {
		resetState();
		setShowApproveTransferModal(false);
	};
	useEffect(() => {
		// Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
		function handleClickOutside(event) {
			if (modal.current && !modal.current.contains(event.target)) {
				updateModal();
			}
		}

		// Bind the event listener
		if (approveTransferState !== APPROVING && approveTransferState !== TRANSFERRING) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [modal, approveTransferState]);

	const isDisabled = (!recipient || !flowRate || !ethers.utils.isAddress(recipient) || isNaN(flowRate)) && showModal !== 'delete';
	console.log(isDisabled);
	
	let title = {
		[CONFIRM]: `${appState.utils.capitalize(showModal)} Stream`,
		[APPROVING]: approvingTitle || 'Approve',
		[TRANSFERRING]: `${appState.utils.capitalize(showModal)} Stream`,
		[SUCCESS]: showModal === 'delete' ? 'Stream deleted' : 'Transaction Complete!', 
		[ERROR]: `${error.title}`,
	};
	let approveStyles = {
		[CONFIRM]: `bg-button-inside border-button ${isDisabled ? 'cursor-not-allowed' : 'hover:bg-button-inside-hover'} border`,
		[APPROVING]: 'bg-button-inside border-button border',
		[TRANSFERRING]: 'border-transparent',
	};


	let fundStyles = {
		[CONFIRM]: 'px-8 border-transparent',
		[APPROVING]: 'px-8 border-transparent',
		[TRANSFERRING]: 'bg-button-inside border-button border'
	};
	if ('0x0000000000000000000000000000000000000000' === token.address) {
		fundStyles = { ...approveStyles };
	}

	let message = {
		[CONFIRM]: `${confirmationMessage}`,
		[APPROVING]: approvingMessage || 'Approving...',
		[TRANSFERRING]: 'Transferring...',
		[SUCCESS]: `Transaction confirmed! Check out your transaction with the link below:\n
		`,
		[ERROR]: `${error.message}`,
	};

	let link = {
		[SUCCESS]: `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`,
		[ERROR]: error.link
	};

	let linkText = {
		[ERROR]: `${error.linkText}`
	};



	const handleRecipientChange = (e) => {
		setRecipient(e.target.value);
	};


	

	function onCurrencySelect(token) {
		setLocalToken({ ...token, address: ethers.utils.getAddress(token.address) });
	}
	
	const toIng = (word, bool)=>{
		if(bool)		return word.slice(0, length-1)+ 'ing';
		return word;};

	function handleFlowRateChange(e) {
		const volume = e.target.value;
		const numberRegex = /^(\d+)?(\.)?(\d+)?$/;
		if (numberRegex.test(volume) || volume === '' || volume === '.') {
			setFlowRate(parseFloat(volume.match(numberRegex)[0]));
		}
	}
	
	return (
		<div>
			<div className="justify-center items-center font-mont flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 md:pl-20 outline-none focus:outline-none">
				<div ref={modal} className="w-1/3 min-w-[320px]">
					<div className="border rounded-lg p-7 shadow-lg flex flex-col w-full bg-dark-mode outline-none focus:outline-none border-web-gray border">
						<div className="flex items-center border-solid">
							<div className="flex flex-row">
								<div className="text-2xl font-semibold pb-2">
									{title[approveTransferState]}
								</div>
							</div>
						</div>
						{approveTransferState ===ERROR ?
							<div className="text-md pb-4">
								<p className="break-words">
									{message[approveTransferState]}
								</p>
								{link[approveTransferState] &&
									<p className='break-all underline'>
										<Link href={link[approveTransferState]}>
											<a target={'_blank'} rel="noopener noreferrer">
												{linkText[approveTransferState] || link[approveTransferState]}
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
													<path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
												</svg>
											</a>
										</Link>
									</p>}
							</div> :
							approveTransferState === SUCCESS ?
								showModal === 'delete' ?
									<div className='pb-4'>Stream of {token.symbol} to {recipient.slice(0, 4)}...{recipient.slice(38)} deleted.</div>:
									<div className="text-md gap-4 py-6 px-4 grid grid-cols-[1fr_1fr] w-full justify-between">
										<div className='w-4'>Streaming</div>
										<div className='flex flex-wrap justify-between w-[120px] gap-2'><Image width={24} className="inline" height={24} src={token.path || token.logoURI||'/crypto-logs/ERC20.svg'} />
											<span> {token.symbol}</span></div>
										<span className='pt-2'>To</span>
										
										<CopyAddressToClipboard data={bountyAddress || recipient} clipping={[5, 38]} /> 
										
										{bounty?.url &&<><span>For</span> <Link href={bounty.url}><a target="_blank" rel="noopener noreferrer" className='underline'>{bounty.title}</a></Link></>}
										<span>Transaction</span>
										<Link href={link[approveTransferState]}>
											<a target={'_blank'} className="underline" rel="noopener noreferrer">
												{transactionHash.slice(0, 5)} . . . {transactionHash.slice(62)}
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
													<path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
												</svg>
											</a>
										</Link>

									</div>
								:
								<>
									<div className="text-md gap-4 gap-x-12 py-6 px-2 grid grid-cols-[1fr_1fr] w-full justify-between">
										
										{showModal !== 'delete' && approveTransferState !==ERROR &&<>
											<div className='w-4'>Funding</div>
											<TokenSearch
												stream={true}
												token={localToken}
												onCurrencySelect={onCurrencySelect}/>
											<span className='py-2'>Flow Rate</span>
											<div className={'flex border border-web-gray rounded-lg py-px pl-2 h-10'}>
												<input className='bg-transparent py-px outline-none'
													type="text"
													name="flowRate"
													value={flowRate}
													onChange={handleFlowRateChange}
													placeholder="flow rate in tokens/day"
												/>
											</div>
										</>}
										<span className='py-2'>To</span>
										<div className={'flex stream border border-web-gray rounded-lg py-px pl-2 '}>
											<input className='bg-transparent py-px pr-3 outline-none'
												type="text"
												name="recipient"
												value={recipient}
												onChange={handleRecipientChange}
												placeholder="recipient address"
											/>
										</div>
										{ bounty?.url &&		
										<>
											<span>For</span><Link href={bounty.url}><a target="_blank" rel="noopener noreferrer" className='underline'>{bounty.title}</a></Link>
										</>}

									</div>
									<>
										<p className='pb-2'>{(approveTransferState === CONFIRM || approveTransferState === APPROVING ) && showModal !== 'delete' ? 'First you\'ll need to let openq access the streaming amount for the first month.' : approveTransferState === TRANSFERRING && showModal !== 'delete'&& `Now you can ${showModal} the stream.`}</p>
								
										{showModal !== 'delete' ? 
											<div className='flex w-full justify-evenly px-1.5 gap-2 border-web-gray border rounded-lg py-1.5 self-center'>
							
												{showModal !== 'delete' && approveTransferState !==ERROR && <button onClick={()=>confirmMethod(recipient, flowRate, showModal)} disabled={approveTransferState !== CONFIRM || isDisabled} className={`text-center border px-1.5 flex  gap-2 py-1.5 ${approveTransferState === CONFIRM && !isDisabled? 'cursor-pointer' : null} ${approveStyles[approveTransferState]} rounded-lg`}>
													<ToolTip hideToolTip={!isDisabled} customOffsets={[-60, 30]} toolTipText="Please add the target address and the stream rate you'd like to approve.">	<span>{approveTransferState === CONFIRM ? 'Approve' : approveTransferState === APPROVING ? 'Approving' : 'Approved'}
													</span></ToolTip>
													{approveTransferState === APPROVING  && <LoadingIcon className={'inline pt-1'} />}
												</button>}

												{
													approveTransferState === SUCCESS || approveTransferState === ERROR ?
														null:
								
														
														<button onClick={()=>deleteFlow(recipient)} className={`text-center px-2 flex gap-2 py-1.5 border ${fundStyles[approveTransferState]} rounded-lg`}>
															<span>{appState.utils.capitalize(toIng(showModal, approveTransferState === TRANSFERRING))} Stream</span>
															{approveTransferState === TRANSFERRING && <LoadingIcon className={'inline'} />}
														</button>
												}
												
											</div> :
											<button onClick={()=>deleteFlow(recipient)} disabled={approveTransferState !== CONFIRM} className={'text-center px-2 gap-2 py-1.5 text-center flex justify-center gap-4 bg-button-inside border-button border rounded-lg'}>
												<span>{appState.utils.capitalize(toIng(showModal, approveTransferState === TRANSFERRING))}</span>
												{approveTransferState === TRANSFERRING && <LoadingIcon className={'inline'} />}
											</button>
										}
									</>
								</>}
								
						{approveTransferState == ERROR || approveTransferState == SUCCESS ? (
							<div className="flex items-center justify-center text-lg rounded-b">
								<button onClick={() => updateModal()} className='text-center bg-button-inside hover:bg-button-inside-hover border border-button px-6 gap-2 py-1.5 text-center flex justify-center gap-4 cursor-pointer rounded-lg'>
									<span>Close</span>
									{approveTransferState === TRANSFERRING && <LoadingIcon className={'inline pt-1'} />}
								</button>
							</div>
						) : null}
					</div>
				</div>
			</div>
			<div className="bg-overlay fixed inset-0"></div>
		</div>
	);
};

export default ApproveStreamModal;
