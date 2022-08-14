// Third party
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

// Custom
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import BountyAlreadyMintedMessage from './BountyAlreadyMintedMessage';
import ToolTipNew from '../Utils/ToolTipNew';
import MintBountyModalButton from './MintBountyModalButton';
import MintBountyHeader from './MintBountyHeader';
import MintBountyInput from './MintBountyInput';
import ErrorModal from '../ConfirmErrorSuccessModals/ErrorModal';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';
import SmallToggle from '../Utils/SmallToggle';
import TierInput from './TierInput';
import TokenFundBox from '../FundBounty/SearchTokens/TokenFundBox';
import SubMenu from '../Utils/SubMenu';

const MintBountyModal = ({ modalVisibility, type, hideSubmenu }) => {
	// Context
	const [appState, dispatch] = useContext(StoreContext);
	const { library, account } = useWeb3();
	const router = useRouter();
	const zeroAddressMetadata = {
		name: 'Matic',
		address: '0x0000000000000000000000000000000000000000',
		symbol: 'MATIC',
		decimals: 18,
		chainId: 80001,
		path: 'https://wallet-asset.matic.network/img/tokens/matic.svg'
	};

	// State
	const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
	const [issue, setIssue] = useState();
	const [url, setUrl] = useState('');
	const [bountyAddress, setBountyAddress] = useState();
	const [isLoading, setIsLoading] = useState();
	const [error, setError] = useState();
	const [claimed, setClaimed] = useState();
	const [enableMint, setEnableMint] = useState();
	const isValidUrl = appState.utils.issurUrlRegex(url);
	const [invoice, setInvoice] = useState(false);
	const [tier, setTier] = useState(0);
	const [tierArr, setTierArr] = useState([]);
	const [tierVolume, setTierVolume] = useState({});
	const [finalTierVolume, setFinalTierVolume] = useState([]);
	const [payoutVolume, setPayoutVolume] = useState('');
	const [payoutToken, setPayoutToken] = useState(zeroAddressMetadata);
	const [toggleType, setToggleType] = useState(type || 'Atomic');
	const [goalVolume, setGoalVolume] = useState('');
	const [goalToken, setGoalToken] = useState(zeroAddressMetadata);

	// Refs
	const modal = useRef();

	const setIssueUrl = async (issueUrl) => {
		if (!isLoading) {
			setEnableMint();
			let didCancel = false;
			setUrl(issueUrl);
			let issueUrlIsValid = appState.utils.issurUrlRegex(issueUrl);
			if (issueUrlIsValid && !didCancel) {

				async function fetchIssue() {
					try {
						const data = await appState.githubRepository.fetchIssueByUrl(issueUrl);
						if (!didCancel) {
							setIssue(data);
						}
						return data;
					} catch (error) {
						if (!didCancel) {
							setIssue(false);
						}
					}
				}
				const issueData = await fetchIssue();

				if (issueData) {

					try {
						let bounty = await appState.openQSubgraphClient.getBountyByGithubId(
							issueData.id,
						);
						setClaimed(bounty.status === 'CLOSED');
						if (bounty) {
							setBountyAddress(bounty.bountyAddress);
						}

					} catch (error) {
						setEnableMint(true);
						setBountyAddress();
					}
				}

			}
			return (() => {
				didCancel = true;
			});
		}
	};
	const mintBounty = async () => {
		console.log('tierVolume object:', tierVolume);
		console.log('finalTierVolume object in MintBounty:', finalTierVolume);
		try {
			setIsLoading(true);
			let data;
			switch (toggleType) {
				case 'Atomic':
					data = { fundingTokenVolume: goalVolume, fundingTokenAddress: goalToken };
					break;
				case 'Repeating':
					data = { payoutVolume: payoutVolume, payoutToken: payoutToken, fundingTokenVolume: goalVolume, fundingTokenAddress: goalToken };
					break;
				case 'Contest':
					data = { fundingTokenVolume: goalVolume, fundingTokenAddress: goalToken, tiers: finalTierVolume };
					break;
				default:
					throw new Error(`No type: ${toggleType}`);
			}

			const { bountyAddress } = await appState.openQClient.mintBounty(
				library,
				issue.id,
				issue.repository.owner.id,
				toggleType,
				data
			);
			console.log('Mint bounty data:', data);
			sessionStorage.setItem('justMinted', true);
			router.push(
				`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${issue.id}/${bountyAddress.toLowerCase()}`
			);
		} catch (error) {
			console.log('error in mintbounty', error);
			const { message, title } = appState.openQClient.handleError(error);
			console.log(message);
			setError({ message, title });

		}
	};

	const connectWallet = () => {
		const payload = {
			type: 'CONNECT_WALLET',
			payload: true
		};
		dispatch(payload);
	};

	const closeModal = () => {
		setIssue();
		setUrl();
		setBountyAddress();
		setIsLoading();
		setError();
		modalVisibility(false);
	};

	useEffect(() => {
		// Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
		function handleClickOutside(event) {
			if (modal.current && !modal.current.contains(event.target) && !appState.walletConnectModal && !document.getElementById('connect-modal')?.contains(event.target)) {
				modalVisibility(false);
			}
		}

		// Bind the event listener
		if (!isLoading) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [modal, isLoading]);

	// Methods

	function onTierChange(e) {
		if (parseInt(e.target.value) >= 0) { setTier(parseInt(e.target.value)); }
		if (parseInt(e.target.value) > 100) { setTier('0'); }
		if (e.target.value === '') setTier('0');
		setTierArr(Array.from({ length: e.target.value }, (_, i) => i + 1));
	}

	const handleGoalChange = (goalVolume) => {
		appState.utils.updateVolume(goalVolume, setGoalVolume);
	};

	function onGoalCurrencySelect(token) {
		setGoalToken({ ...token, address: ethers.utils.getAddress(token.address) });
	}

	function onCurrencySelect(payoutToken) {
		setPayoutToken({ ...payoutToken, address: ethers.utils.getAddress(payoutToken.address) });
	}

	function onVolumeChange(payoutVolume) {
		appState.utils.updateVolume(payoutVolume, setPayoutVolume);
	}

	function onTierVolumeChange(e) {
		if (parseFloat(e.target.value) >= 0) setTierVolume({ ...tierVolume, [e.target.name]: parseFloat(e.target.value) });
		if (parseFloat(e.target.value) === '') setTierVolume({ ...tierVolume, [e.target.name]: '0' });
		console.log(tier, tierArr, tierVolume);
	}

	useEffect(() => {
		setFinalTierVolume(Object.values(tierVolume));
	}, [tierVolume]);

	// Render
	return (
		<div className={`justify-center items-start sm:items-center mx-4 overflow-x-hidden overflow-y-auto fixed inset-0 outline-none z-50 focus:outline-none p-10 ${appState.walletConnectModal ? 'hidden' : 'flex'}`}>
			{error ?
				<ErrorModal
					setShowErrorModal={closeModal}
					error={error}
				/> :
				<>
					<div ref={modal} className="m-auto w-3/5 min-w-[320px] z-50 fixed top-24">
						<div className="w-full rounded-sm flex flex-col bg-[#161B22] z-11 space-y-1">
							{!hideSubmenu && <SubMenu items={[{ name: 'Atomic' }, { name: 'Repeating' }, { name: 'Contest' }]} internalMenu={toggleType} updatePage={setToggleType} styles={'justify-center'} />}
							<div className='max-h-[70vh] w-full overflow-y-auto'>
								<MintBountyHeader type={toggleType} />
								<div className="flex flex-col items-center pl-6 pr-6">
									<MintBountyInput
										setIssueUrl={setIssueUrl}
										issueData={issue}
										url={url}
										isValidUrl={isValidUrl}
									/>
								</div>
								{isValidUrl && !issue &&
									<div className="flex flex-col items-center pt-5 ">
										Github Issue not found
									</div>}
								<div className="flex flex-col items-center space-x-1 px-8">
									{isValidUrl && issue?.closed && !bountyAddress &&
										<div className="text-center pt-3 ">
											This issue is already closed on GitHub
										</div>}
									{isValidUrl && bountyAddress && issue &&
										<BountyAlreadyMintedMessage claimed={claimed} id={issue.id} bountyAddress={bountyAddress} />}
								</div>

								{toggleType ?
									<>
										<div className="flex flex-col items-center pl-6 pr-6 pb-2">
											<div className="flex flex-col w-4/5 md:w-2/3">
												<div className='flex flex-col w-full items-start p-2 py-1 text-base bg-[#161B22]'>
													<div className='flex items-center gap-2'>Is this Contract invoiceable?
														<ToolTipNew mobileX={10} toolTipText={'Do you want an invoice for this contract?'} >
															<div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>?</div>
														</ToolTipNew>
													</div>
													<div className='flex-1 w-full mt-2 ml-4'>
														<SmallToggle names={['Yes', 'No']} toggleVal={invoice ? 'Yes' : 'No'} toggleFunc={() => setInvoice(!invoice)} />
													</div>
												</div>
											</div>
										</div>
									</>
									:
									null
								}

								<div className="flex flex-col items-center pl-6 pr-6 pb-2">
									<div className="flex flex-col w-4/5 md:w-2/3">
										<div className='flex flex-col w-full items-start p-2 py-1 text-base bg-[#161B22]'>
											<div className='flex items-center gap-2'>Budget
												<ToolTipNew mobileX={10} toolTipText={toggleType === 'Atomic' ? 'Amount of funds you would like to escrow on this issue.' : 'How much will each successful submitter earn?'} >
													<div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>?</div>

												</ToolTipNew>
											</div>
											<span className='text-sm my-2'>You don{'\''}t have to deposit now! The budget is just what you intend to pay.</span>
											<div className='flex-1 w-full mt-2 ml-4'>
												<TokenFundBox
													onCurrencySelect={onGoalCurrencySelect}
													onVolumeChange={handleGoalChange}
													volume={goalVolume}
													token={goalToken}
												/>
											</div>
										</div>
									</div>
								</div>

								{toggleType === 'Repeating' ?
									<>
										<div className="flex flex-col items-center pl-6 pr-6 pb-2">
											<div className="flex flex-col w-4/5 md:w-2/3">
												<div className='flex flex-col w-full items-start p-2 py-1 text-base bg-[#161B22]'>
													<div className='flex items-center gap-2'> Reward Split?
														<ToolTipNew mobileX={10} toolTipText={'How much will each successful submitter earn?'} >
															<div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>?</div>
														</ToolTipNew>
													</div>
													<div className='flex-1 w-full mt-2 ml-4'>
														<TokenFundBox
															onCurrencySelect={onCurrencySelect}
															onVolumeChange={onVolumeChange}
															token={payoutToken}
															volume={payoutVolume}
														/>
													</div>
												</div>
											</div>
										</div>
									</>
									: toggleType === 'Contest' ?
										<>
											<div className="flex flex-col items-center pl-6 pr-6 pb-2">
												<div className="flex flex-col w-4/5 md:w-2/3">
													<div className='flex flex-col w-full items-start p-2 py-1 text-base pb-4'>
														<div className='flex items-center gap-2'>How many Tiers?
															<ToolTipNew mobileX={10} toolTipText={'How many people will be able to claim a prize? Don\'t exceed 100.'} >
																<div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>?</div>
															</ToolTipNew>
														</div>
														<div className='flex-1 w-full mt-2 ml-4'>
															<input
																className={'flex-1 input-field w-full'}
																id="name"
																placeholder="0"
																autoComplete="off"
																type="text"
																min="0"
																max="100"
																value={tier}
																onChange={(e) => onTierChange(e)}
															/>
														</div>
													</div>
													{tier > 0 ?
														<>
															<div className='flex flex-col w-full items-start p-2 py-1 pb-0 text-base'>
																<div className='flex items-center gap-2 pb-2'>Weight per Tier
																	<ToolTipNew mobileX={10} toolTipText={'How much will each winner earn?'} >
																		<div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>?</div>
																	</ToolTipNew>
																</div>
																<div className='max-h-40 w-full overflow-y-auto overflow-x-hidden'>
																	{tierArr.map((t) => {
																		return (
																			<div key={t}>
																				<TierInput tier={t} tierVolume={tierVolume[t]} onTierVolumeChange={onTierVolumeChange} />
																			</div>
																		)
																	})}
																</div>
															</div>
														</>
														: null
													}
												</div>
											</div>
										</>
										:
										null
								}

								<div className="p-5 pt-2 py-10 w-full">
									<ToolTipNew
										outerStyles={''}
										hideToolTip={(enableMint && isOnCorrectNetwork && !issue?.closed && account) || isLoading}
										toolTipText={
											account && isOnCorrectNetwork ?
												'Please choose an elgible issue.' :
												isOnCorrectNetwork ?
													'Connect your wallet to mint a bounty!' :
													'Please switch to the correct network to mint a bounty.'
										}>

										<MintBountyModalButton
											mintBounty={(account) ? mintBounty : connectWallet}
											account={account}
											enableMint={(enableMint && isOnCorrectNetwork && !issue?.closed && !isLoading) || !account}
											transactionPending={isLoading}
										/>

									</ToolTipNew>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-overlay fixed inset-0 z-10"></div>
				</>}
		</div>
	);
};

export default MintBountyModal;
