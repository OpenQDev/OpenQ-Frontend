// Third party
import React, { useRef, useEffect, useState } from 'react';
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
	volume,
	bountyAddress,
	bounty,
	stream,
	showModal
}) => {
	const modal = useRef();
	const [recipient, setRecipient] = useState('');
	const [flowRate, setFlowRate] = useState('');
	const [localToken, setLocalToken] = useState({name: 'fDaiX',
		address: '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f',
		symbol: 'FDAIX',
		decimals: 18,
		chainId: 80001,
		path: '/crypto-logos/FDAIX.svg'});
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

	let title = {
		[CONFIRM]: `${showModal} Stream`,
		[APPROVING]: approvingTitle || 'Approve',
		[TRANSFERRING]: 'Create/Update Stream',
		[SUCCESS]: 'Transfer Complete!', 
		[ERROR]: `${error.title}`,
	};
	let approveStyles = {
		[CONFIRM]: 'bg-button-inside border-button hover:bg-button-inside-hover border',
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
		console.log(recipient);
		setRecipient(e.target.value);
	};


	

	function onCurrencySelect(token) {
		setLocalToken({ ...token, address: ethers.utils.getAddress(token.address) });
	}
	


	const isDisabled = !recipient || !flowRate || !ethers.utils.isAddress(recipient) || isNaN(flowRate);
	
	function handleFlowRateChange(e) {
		const volume = e.target.value;
		const numberRegex = /^(\d+)?(\.)?(\d+)?$/;
		if (numberRegex.test(volume) || volume === '' || volume === '.') {
			console.log();
			setFlowRate(parseFloat(volume.match(numberRegex)[0]));
		}
	}
	volume =Math.round(volume*Math.pow(10, 10))/Math.pow(10, 10);
	console.log(stream);
	return (
		<div>
			<div className="justify-center items-center font-mont flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 md:pl-20 outline-none focus:outline-none">
				<div ref={modal} className="w-1/4 min-w-[340px]">
					<div className="border rounded-lg p-7 shadow-lg flex flex-col w-full bg-dark-mode outline-none focus:outline-none border-web-gray border">
						<div className="flex items-center border-solid">
							<div className="flex flex-row">
								<div className="text-2xl font-semibold pb-2">
									{title[approveTransferState]}
								</div>
							</div>
						</div>
						{approveTransferState === 'ERROR' ?
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
								<>
									<div className="text-md gap-4 py-6 px-4 grid grid-cols-[1fr_1fr] w-full justify-between">
										<div className='w-4'>Deposited</div>
										<div className='flex flex-wrap justify-between w-[120px] gap-2'><Image width={24} className="inline" height={24} src={token.path || token.logoURI||'/crypto-logs/ERC20.svg'} /><span>{!stream && volume} {token.symbol}</span></div>
										<span>To</span>
										
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
								</> :
								<div className="text-md gap-4 py-6 px-2 grid grid-cols-[1fr_1fr] w-full justify-between">
										
									{showModal !== 'delete'&&<>
										<div className='w-4'>Funding</div>
										<TokenSearch
											stream={true}
											token={localToken}
											onCurrencySelect={onCurrencySelect}/>
										<span className='py-2'>Flow Rate</span>
										<div className={'flex border border-web-gray rounded-lg py-px pl-2 '}>
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
										<input className='bg-transparent py-px outline-none'
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
						}
						{token.address !== '0x0000000000000000000000000000000000000000' ?
							<div className='flex w-full justify-evenly px-1.5 gap-2 border-web-gray border rounded-lg py-1.5 self-center'>
								{showModal !== 'delete' && <button onClick={()=>confirmMethod(recipient, flowRate, showModal)} disabled={approveTransferState !== CONFIRM} className={`text-center border px-1.5 flex  gap-2 py-1.5 ${approveTransferState === CONFIRM ? 'cursor-pointer' : null} ${approveStyles[approveTransferState]} rounded-lg`}>
									<span>{approveTransferState === CONFIRM ? 'Approve' : approveTransferState === APPROVING ? 'Approving' : 'Approved'}
									</span>
									{approveTransferState === APPROVING && <LoadingIcon className={'inline pt-1'} />}
								</button>}

								{showModal === 'create' ?<div disabled={isDisabled} onClick={()=>stream(recipient, flowRate, 'create')} className={`text-center px-2 flex gap-2 py-1.5 border ${approveTransferState === TRANSFERRING ? 'cursor-pointer' : null} ${fundStyles[approveTransferState]} rounded-lg ${isDisabled ? '' : ' cursor-pointer'}`}>
									<span>Create Stream</span>
								</div> :
									showModal === 'update' ?
										<button disabled={isDisabled} onClick={()=>stream(recipient, flowRate, 'update')} className={`text-center px-2 flex gap-2 py-1.5 border ${approveTransferState === TRANSFERRING ? 'cursor-pointer' : null} ${fundStyles[approveTransferState]} rounded-lg ${isDisabled ? '' : 'confirm-btn cursor-pointer'}`}>
											<span>Update Stream</span>
										</button>:
													
										showModal === 'delete' ?
											<button disabled={isDisabled} onClick={()=>stream(recipient, flowRate, showModal)} className={`text-center px-2 flex gap-2 py-1.5 border ${approveTransferState === TRANSFERRING ? 'cursor-pointer' : null} ${fundStyles[approveTransferState]} rounded-lg ${isDisabled ? '' : 'confirm-btn cursor-pointer'}`}>
												<span>{showModal} Steam</span>
											</button>: <div>{showModal}</div>
								}
												
							</div> :
							<button onClick={()=>confirmMethod(flowRate)} disabled={approveTransferState !== CONFIRM} className={`text-center px-2 gap-2 py-1.5 text-center flex justify-center gap-4 ${fundStyles[approveTransferState]} rounded-lg`}>
								<span>{approveTransferState === TRANSFERRING ? 'Funding' : 'Fund'}</span>
							</button>
						}
								
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
