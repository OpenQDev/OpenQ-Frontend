// Third party Libraries
import React, { useState, useContext, useEffect } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import { ethers } from 'ethers';
import TokenFundBox from '../FundBounty/SearchTokens/TokenFundBox';
import AdminModal from './AdminModal.js';
import ToolTipNew from '../Utils/ToolTipNew';
import TierInput from '../MintBounty/TierInput';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';

const AdminPage = ({ bounty, refreshBounty }) => {

	let type = 'Atomic Contract';

	switch (bounty.bountyType) {
		case '1':
			type = 'Repeating Contract';
			break;
		case '2':
			type = 'Contest Contract';
			break;
		case '3':
			type = 'Atomic Contract';
			break;
	}

	// Context
	const { library, account, } = useWeb3();
	const [appState] = useContext(StoreContext);
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
	const [modal, setModal] = useState();
	const [error, setError] = useState('');
	const [showButton, setShowButton] = useState(ethers.utils.getAddress(bounty.issuer.id) == account && !bounty.bountyClosedTime);
	const [tokenValues] = useGetTokenValues(bounty.bountyTokenBalances);

	// funding goal volume and token
	const [volume, setVolume] = useState('');
	const [token, setToken] = useState(zeroAddressMetadata);

	// payout volume and token
	const [payoutVolume, setPayoutVolume] = useState('');
	const [payoutToken, setPayoutToken] = useState(zeroAddressMetadata);

	// contest state
	const [tier, setTier] = useState(0);
	const [tierArr, setTierArr] = useState([]);
	const [tierVolume, setTierVolume] = useState({});
	const [finalTierVolume, setFinalTierVolume] = useState([]);
	const [sum, setSum] = useState(0);
	const [enableContest, setEnableContest] = useState(false);
	const [isLoading, setIsLoading] = useState();
	const tierConditions = sum == 100

	// handle change in Funding Goal

	function onCurrencySelect(token) {
		setToken({ ...token, address: ethers.utils.getAddress(token.address) });
	}

	function onVolumeChange(volume) {
		appState.utils.updateVolume(volume, setVolume);
	}

	// handle change in Payout for Ongoing Contracts

	function onPayoutTokenSelect(payoutToken) {
		setPayoutToken({ ...payoutToken, address: ethers.utils.getAddress(payoutToken.address) });
	}

	function onPayoutVolumeChange(payoutVolume) {
		appState.utils.updateVolume(payoutVolume, setPayoutVolume);
	}

	// handle change in Payout for Contests

	function onTierChange(e) {
		if (parseInt(e.target.value) >= 0) { setTier(parseInt(e.target.value)); }
		if (parseInt(e.target.value) > 100) { setTier('0'); }
		if (e.target.value === '') setTier('0');
		setTierArr(Array.from({ length: e.target.value }, (_, i) => i + 1));
	}

	function onTierVolumeChange(e) {
		if (parseInt(e.target.value) >= 0) setTierVolume({ ...tierVolume, [e.target.name]: parseInt(e.target.value) });
		if (parseInt(e.target.value) === '' || !Number(e.target.value) || parseInt(e.target.value) > 100)
			setTierVolume({ ...tierVolume, [e.target.name]: '' });
	}

	function handleSuffix(t) {
		const s = ['th', 'st', 'nd', 'rd'];
		const v = t % 100;
		return (t + (s[(v - 20) % 10] || s[v] || s[0]));
	}

	// useEffect

	useEffect(() => {
		setFinalTierVolume(Object.values(tierVolume));
	}, [tierVolume]);

	useEffect(() => {
		if (finalTierVolume.length) {
			setSum(finalTierVolume.reduce((a, b) => a + b));
		}
		if (sum == 100) { setEnableContest(true) };
	}, [finalTierVolume]);

	useEffect(() => {
		if (!tierConditions) { setEnableContest(false) }
		else { setEnableContest(true) };
	}, [tier, sum])

	// trigger smart contracts

	async function setBudget() {
		try {
			setIsLoading(true);
			const transaction = await appState.openQClient.setFundingGoal(library, bounty.bountyId, token, volume);
			refreshBounty();
			setVolume('');
			setModal({ transaction, type: 'Budget' });
		} catch (error) {
			console.log(error);
			const { message, title } = appState.openQClient.handleError(error, { bounty });
			setError({ message, title });
		}
	}

	async function setPayout() {
		try {
			setIsLoading(true);
			const transaction = await appState.openQClient.setPayout(library, bounty.bountyId, payoutToken, payoutVolume);
			refreshBounty();
			setPayoutVolume('');
			setModal({ transaction, type: 'Payout' });
		} catch (error) {
			console.log(error);
			const { message, title } = appState.openQClient.handleError(error, { bounty });
			setError({ message, title });
		}
	}

	async function setContestPayout() {
		try {
			setIsLoading(true);
			// change this
			const transaction = await appState.openQClient.setPayout(library, bounty.bountyId, payoutToken, payoutVolume);
			refreshBounty();
			setPayoutVolume('');
			setModal({ transaction, type: 'Payout' });
		} catch (error) {
			console.log(error);
			const { message, title } = appState.openQClient.handleError(error, { bounty });
			setError({ message, title });
		}
	}

	async function closeCompetition() {
		try {
			setIsLoading(true);
			const transaction = await appState.openQClient.closeCompetition(library, bounty.bountyId);
			setModal({ transaction, type: 'Closed Contest' });
			setShowButton(false);
			refreshBounty();
			//	dispatch(payload);
		} catch (error) {
			console.log(error);
			const { message, title } = appState.openQClient.handleError(error, { bounty });
			setError({ message, title });
		}
	}

	async function closeOngoing() {
		try {
			setIsLoading(true);
			const transaction = await appState.openQClient.closeOngoing(library, bounty.bountyId);
			setModal({ transaction, type: 'Closed Repeatable' });
			setShowButton(false);
			refreshBounty();
		} catch (error) {
			console.log(error);
			const { message, title } = appState.openQClient.handleError(error, { bounty });
			setError({ message, title });
		}
	}

	return (<>
		{showButton &&
			<div className='flex w-full px-2 sm:px-8 flex-wrap max-w-[1200px] pb-8 mx-auto'>
				<div className="flex flex-1 flex-col space-y-8 sm:px-12 px-4 pt-4 pb-8 w-full max-w-[800px] justify-center">
					<div className="flex flex-col space-y-2 items-center w-full md:border rounded-sm border-gray-700 text-primary pb-8">
						<h1 className="flex w-full text-3xl justify-center px-12 py-4 md:bg-[#161b22] md:border-b border-gray-700 rounded-t-sm">
							Settings
						</h1>
						<div className="flex flex-col space-y-5 w-full px-8 pt-2">
							<h2 className='text-2xl border-b border-gray-700 pb-4'>Modifications</h2>
							<div className='flex items-center gap-2'>Set a New Budget for this Contract</div>
							<div className='flex-1 items-center w-full mt-2'>
								<TokenFundBox
									onCurrencySelect={onCurrencySelect}
									onVolumeChange={onVolumeChange}
									token={token}
									volume={volume}
								/>
							</div>
							<button
								className="btn-default"
								type="button"
								onClick={setBudget}
							>Set New Budget</button>

							{bounty.bountyType == '2' ?
								<>
									<div className="flex flex-col items-center pb-2">
										<div className="flex flex-col w-full md:w-full">
											<div className='flex flex-col w-full items-start p-2 py-1 text-base pb-4'>
												<div className='flex items-center gap-2'>How many Tiers?
													<ToolTipNew mobileX={10} toolTipText={'How many people will be able to claim a prize? Don\'t exceed 100.'} >
														<div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>?</div>
													</ToolTipNew>
												</div>
												<div className='flex-1 w-full mt-2'>
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
														<div className='flex items-center gap-2 '>Weight per Tier (%)
															<ToolTipNew mobileX={10} toolTipText={'How much % of the total will each winner earn?'} >
																<div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>?</div>
															</ToolTipNew>
														</div>
														{sum > 100 ?
															<span className='text-sm my-2 pb-2 text-[#f85149]'>The sum can not be more than 100%!</span>
															:
															<span className='text-sm my-2 pb-2'>For the sum to add up to 100, you still need to allocate: {100 - sum} %</span>
														}
														<div className='max-h-40 w-full overflow-y-auto overflow-x-hidden'>
															{tierArr.map((t) => {
																return (
																	<div key={t}>
																		<TierInput tier={t} tierVolume={tierVolume[t]} onTierVolumeChange={onTierVolumeChange} style={'ml-0'} />
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
									<ToolTipNew
										hideToolTip={(enableContest && isOnCorrectNetwork && account) || isLoading}
										toolTipText={
											account && isOnCorrectNetwork && !enableContest ?
												'Please make sure the sum of tier percentages adds up to 100.' :
												isOnCorrectNetwork ?
													'Connect your wallet to mint a bounty!' :
													'Please switch to the correct network to mint a bounty.'
										}>
										<button
											className={`w-full btn-default ${enableContest ? 'cursor-pointer' : 'cursor-not-allowed'}`}
											type="button"
											onClick={setContestPayout}
											disabled={!enableContest}
										>Set New Payout</button>
									</ToolTipNew>

									<h2 className='text-2xl text-[#f85149] border-b border-gray-700 pb-4'>Close Contract</h2>
									<div className='flex items-center gap-2'>Once you close the contract for this contest, there is no going back. Please be certain.
									</div>
									<button
										className="btn-danger"
										type="button"
										onClick={closeCompetition}
									>Close Competition</button>
								</>

								:
								bounty.bountyType == '1' ?
									<>
										<div className='flex items-center gap-2'>Set Payout for Each Submitter</div>

										<div className='flex-1 items-center w-full mt-2'>
											<TokenFundBox
												onCurrencySelect={onPayoutTokenSelect}
												onVolumeChange={onPayoutVolumeChange}
												token={payoutToken}
												volume={payoutVolume}
											/>
										</div>
										<button
											className="btn-default"
											type="button"
											onClick={setPayout}
										>Set Payout</button>

										<h2 className='text-2xl text-[#f85149] border-b border-gray-700 pb-4'>Close Repeatable Contract</h2>
										<div className='flex justify-between items-center gap-2'>Once you close this repeatable contract, there is no going back. Please be certain.
										</div>
										<button
											className="btn-danger"
											type="button"
											onClick={closeOngoing}
										>Close Repeatable Contract</button>
									</>
									:
									null
							}
						</div>
					</div>
				</div>
				<ul className='md:max-w-[300px] w-full md:pl-4'>
					<li className='border-b border-web-gray py-3'>
						<div className='text-xs font-semibold text-muted'>Type</div>
						<div className='text-xs font-semibold text-primary leading-loose' >{type}</div>
					</li>
					<li className='border-b border-web-gray py-3'>
						<div className='text-xs font-semibold text-muted'>TVL</div>
						<button className='text-xs font-semibold text-primary' onClick={() => setInternalMenu('Fund')}>${tokenValues?.total || '0.00'}</button>
					</li>
					<li className='border-b border-web-gray py-3'>
						<div className='text-xs font-semibold text-muted'>Current Target Budget</div>
						<div className='text-xs font-semibold text-primary pt-2' >${'0.00'}</div>
					</li>
					{bounty.bountyType == 1 ?
						<li className='border-b border-web-gray py-3'>
							<div className='text-xs font-semibold text-muted'>Current Reward Split</div>
							<div className='text-xs font-semibold text-primary pt-2' >${'0.00'}</div>
						</li>
						:
						bounty.bountyType == 2 ?
							<li className='border-b border-web-gray py-3'>
								<div className='text-xs font-semibold text-muted'>Current Payout Schedule</div>
								<div className='flex items-center gap-4 pt-2 text-primary'>
									<div className='text-xs font-semibold leading-loose'>Number of tiers: </div>
									<div className='text-xs font-semibold'>{tier}{console.log(bounty)}</div>
								</div>
								<div className='flex flex-col '>
									{['50', '25', '25'].map((t, index) => {
										return (
											<div key={index} className='flex items-center gap-4 text-primary'>
												<div className='text-xs font-semibold leading-loose'>{`${handleSuffix(index+1)} winner`}</div>
												<div className='text-xs font-semibold' >{t}{console.log(bounty)} %</div>
											</div>
										)
									})

									}

								</div>
							</li>
							: null
					}
				</ul>
			</div>
		}
		{modal && <AdminModal setModal={setModal} modal={modal} />}
		{error && <AdminModal setModal={setError} modal={{ type: 'Error', ...error }} />}

	</>



	);
};

export default AdminPage;
