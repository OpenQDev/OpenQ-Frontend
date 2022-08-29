// Third party
import React, { useState, useContext } from 'react';
import { ethers } from 'ethers';

// Custom
import useWeb3 from '../../hooks/useWeb3';
import TokenFundBox from './SearchTokens/TokenFundBox';
import StoreContext from '../../store/Store/StoreContext';
import ButtonLoadingIcon from '../Loading/ButtonLoadingIcon';
import ToolTipNew from '../Utils/ToolTipNew';
import BountyClosed from '../BountyClosed/BountyClosed';
import ApproveFundModal from './ApproveFundModal';
import {
	RESTING,
	CONFIRM,
	APPROVING,
	TRANSFERRING,
	SUCCESS,
	ERROR
} from './ApproveTransferState';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';

const FundPage = ({ bounty, refreshBounty }) => {
	const [volume, setVolume] = useState('');
	const [depositPeriodDays, setDepositPeriodDays] = useState(30);
	const [error, setError] = useState('');
	const [buttonText, setButtonText] = useState('Fund');
	const [, setSuccessMessage] = useState('');
	const [transactionHash, setTransactionHash] = useState(null);
	const [confirmationMessage, setConfirmationMessage] = useState('Please enter a volume greater than 0.');
	const [showApproveTransferModal, setShowApproveTransferModal] = useState(false);
	const [approveTransferState, setApproveTransferState] = useState(RESTING);
	const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
	const zeroAddressMetadata = {
		name: 'Matic',
		address: '0x0000000000000000000000000000000000000000',
		symbol: 'MATIC',
		decimals: 18,
		chainId: 80001,
		path: 'https://wallet-asset.matic.network/img/tokens/matic.svg'
	};
	// Context
	const [appState, dispatch] = useContext(StoreContext);
	const { library, account, } = useWeb3();

	// State
	const [token, setToken] = useState(zeroAddressMetadata);
	const bountyName = bounty.bountyType == 0 ? 'Atomic Contract' : bounty.bountyType == 1 ? 'Repeatable Contract' : bounty.bountyType == 2 ? 'Contest' : 'Type Unknown';

	const closed = bounty.status == '1';
	const loadingClosedOrZero = approveTransferState == CONFIRM || approveTransferState == APPROVING || approveTransferState == TRANSFERRING || closed || parseFloat(volume) <= 0.00000001 || parseFloat(volume) > 1000000 || volume == '' || !(parseInt(depositPeriodDays) > 0);
	const disableOrEnable = `${(loadingClosedOrZero || !isOnCorrectNetwork) && account ? 'btn-default w-full cursor-not-allowed' : 'btn-primary cursor-pointer'}`;
	const fundButtonClasses = `flex flex-row w-full justify-center space-x-5 items-center  ${disableOrEnable}`;

	function resetState() {
		setApproveTransferState(RESTING);
	}

	// Methods

	const openFund = () => {
		setConfirmationMessage(
			`You are about to fund this bounty at address ${bounty.bountyAddress.substring(
				0,
				12
			)}...${bounty.bountyAddress.substring(32)} with ${volume} ${token.name
			}.
									
									This will be refundable after ${depositPeriodDays} ${depositPeriodDays == 1 ? 'day' : 'days'}.
									
									Is this correct?`
		);
		setApproveTransferState(CONFIRM);
		setShowApproveTransferModal(true);
	};

	const connectWallet = () => {
		const payload = {
			type: 'CONNECT_WALLET',
			payload: true
		};
		dispatch(payload);
	};
	async function fundBounty() {
		const volumeInWei = volume * 10 ** token.decimals;
		if (volumeInWei == 0) {
			setError({ title: 'Zero Volume Sent', message: 'Must send a greater than 0 volume of tokens.' });
			setApproveTransferState(ERROR);
			setButtonText('Fund');
			return;
		}

		const bigNumberVolumeInWei = ethers.BigNumber.from(volumeInWei.toLocaleString('fullwide', {useGrouping:false}));

		let approveSucceeded = false;

		try {
			const isWhitelisted = await appState.openQClient.isWhitelisted(library, token.address);

			// Only check bounty token address limit for non-whitelisted tokens
			if (!isWhitelisted) {
				const tokenAddressLimitReached = await appState.openQClient.tokenAddressLimitReached(library, bounty.bountyAddress);
				if (tokenAddressLimitReached) {
					setError({ title: 'Token Address Limit Is Reached!', message: 'Contact info@openq.dev' });
					setApproveTransferState(ERROR);
					return;
				}
			}
		} catch (error) {
			console.error(error);
			setError({ title: 'Call Revert Exception', message: 'A contract call exception occurred. Please try again.' });
			setButtonText('Fund');
			setApproveTransferState(ERROR);
			return;
		}

		try {
			const callerBalance = await appState.openQClient.balanceOf(library, account, ethers.utils.getAddress(token.address));
			if (callerBalance.noSigner) {
				setError({ title: 'No wallet connected.', message: 'Please connect your wallet.' });
				setApproveTransferState(ERROR);
				return;
			} else if (callerBalance.lt(bigNumberVolumeInWei)) {
				setError({ title: 'Funds Too Low', message: 'You do not have sufficient funds for this deposit' });
				setApproveTransferState(ERROR);
				return;
			}
		} catch (error) {
			console.log(error);
			setError({ title: 'Call Revert Exception', message: 'A contract call exception occurred. Please try again.' });
			setButtonText('Fund');
			setApproveTransferState(ERROR);
			return;
		}

		try {
			setShowApproveTransferModal(true);
			if (token.address != ethers.constants.AddressZero) {
				setButtonText('Approving');
				setApproveTransferState(APPROVING);
				await appState.openQClient.approve(
					library,
					bounty.bountyAddress,
					token.address,
					bigNumberVolumeInWei
				);
			}
			approveSucceeded = true;
		} catch (error) {
			console.log(error);
			const { message, title, link, linkText } = appState.openQClient.handleError(error, { bounty });
			setError({ message, title, link, linkText });
			setButtonText('Fund');
			setApproveTransferState(ERROR);
		}

		if (approveSucceeded) {
			setApproveTransferState(TRANSFERRING);
			try {
				const fundTxnReceipt = await appState.openQClient.fundBounty(
					library,
					bounty.bountyAddress,
					token.address,
					bigNumberVolumeInWei,
					depositPeriodDays
				);
				setTransactionHash(fundTxnReceipt.events[0].transactionHash);
				setApproveTransferState(SUCCESS);
				setSuccessMessage(
					`Successfully funded issue ${bounty.url} with ${volume} ${token.symbol}!`
				);
				refreshBounty();
			} catch (error) {
				console.log(error);
				const { message, title } = appState.openQClient.handleError(error, { bounty });
				setError({ message, title });
				setApproveTransferState(ERROR);
			}
			setButtonText('Fund');
		}
	}

	function onCurrencySelect(token) {
		setToken({ ...token, address: ethers.utils.getAddress(token.address) });
	}

	function onVolumeChange(volume) {
		appState.utils.updateVolume(volume, setVolume);
	}
	const onDepositPeriodChanged = (e) => {
		if (parseInt(e.target.value) >= 0) setDepositPeriodDays(parseInt(e.target.value));
		if (e.target.value === '') setDepositPeriodDays('0');
	};

	// Render
	return (<>
		{closed ?
			<>
				<BountyClosed bounty={bounty} />
			</>
			:
			<div className="flex flex-1 sm:px-12 px-4 pt-4 pb-8 w-full max-w-[1200px] justify-center">
				<div className="flex flex-col space-y-5 pb-4 items-center md:border rounded-sm border-gray-700">
					<div className="flex text-3xl text-primary justify-center px-16 py-4 md:bg-[#161b22] md:border-b border-gray-700 rounded-t-sm">
						Escrow Funds in {bountyName}
					</div>
					<div className="flex flex-col space-y-5 w-5/6 pt-2">
						<TokenFundBox
							onCurrencySelect={onCurrencySelect}
							onVolumeChange={onVolumeChange}
							token={token}
							volume={volume}
						/>

						<div className="flex w-full input-field-big">
							<div className=' flex items-center gap-3 w-full text-primary md:whitespace-nowrap'>
								<ToolTipNew toolTipText={'This is the number of days that your deposit will be in escrow. After this many days, your deposit will be fully refundable if the bounty has still not been claimed.'} >
									<div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>?</div>
								</ToolTipNew>
								<span>Deposit Locked Period</span>
							</div>

							<div className={'flex px-4 font-bold bg-dark-mode'}>
								<input
									className="text-primary text-right number outline-none bg-dark-mode w-full flex-1"
									autoComplete="off"
									value={depositPeriodDays}
									id="deposit-period"
									onChange={onDepositPeriodChanged}
								/>
							</div>
						</div>

						<ToolTipNew hideToolTip={account && isOnCorrectNetwork && !loadingClosedOrZero}
							toolTipText={
								account && isOnCorrectNetwork && !(depositPeriodDays > 0) ?
									'Please indicate how many days you\'d like to fund your bounty for.' :
									account && isOnCorrectNetwork ?
										'Please indicate the volume you\'d like to fund with. Must be between 0.0000001 and 1,000,000.' :
										account ?
											'Please switch to the correct network to fund this bounty.' :
											'Connect your wallet to fund this bounty!'}>
							<button
								className={fundButtonClasses}
								disabled={(loadingClosedOrZero || !isOnCorrectNetwork) && account}
								type="button"
								onClick={account ? openFund : connectWallet}
							>
								<div>{account ? buttonText : 'Connect Wallet'}</div>
								<div>{approveTransferState != RESTING && approveTransferState != SUCCESS && approveTransferState != ERROR ? (
									<ButtonLoadingIcon />
								) : null}</div>
							</button>
						</ToolTipNew>
						<div className='text-primary text-[0.8rem]'>Always fund through the interface! Never send funds directly to the address!</div>
					</div>
				</div>

				{showApproveTransferModal && <ApproveFundModal
					approveTransferState={approveTransferState}
					address={account}
					transactionHash={transactionHash}
					confirmationMessage={confirmationMessage}
					error={error}
					setShowApproveTransferModal={setShowApproveTransferModal}
					confirmMethod={fundBounty}
					resetState={resetState}
					token={token}
					volume={volume}
					bountyAddress={bounty.bountyAddress}
					bounty={bounty}
				/>}
			</div>}</>
	);
};

export default FundPage;
