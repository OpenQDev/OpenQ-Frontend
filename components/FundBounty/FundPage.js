import React, { useState, useContext } from 'react';
import TokenFundBox from './SearchTokens/TokenFundBox';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import { ethers } from 'ethers';
import useConfirmErrorSuccessModals from '../../hooks/useConfirmErrorSuccessModals';
import ConfirmErrorSuccessModalsTrio from '../ConfirmErrorSuccessModals/ConfirmErrorSuccessModalsTrio';
import ButtonLoadingIcon from '../Loading/ButtonLoadingIcon';

const FundPage = ({ bounty, refreshBounty }) => {
	const [volume, setVolume] = useState('');
	const [depositPeriodDays, setDepositPeriodDays] = useState(30);
	const {
		showErrorModal,
		setShowErrorModal,
		showSuccessModal,
		setShowSuccessModal,
		showConfirmationModal,
		setShowConfirmationModal,
	} = useConfirmErrorSuccessModals();
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [buttonText, setButtonText] = useState('Fund');
	const [successMessage, setSuccessMessage] = useState('');
	const [transactionHash, setTransactionHash] = useState(null);
	const [confirmationMessage, setConfirmationMessage] = useState('Please enter a volume greater than 0.');

	// Context
	const [appState] = useContext(StoreContext);
	const { library, account } = useWeb3();

	// State
	const [token, setToken] = useState(appState.tokens[0]);

	const claimed = bounty.status == 'CLOSED';
	const loadingClosedOrZero = isLoading || claimed || parseInt(volume) == 0 || volume == '';
	const disableOrEnable = `${loadingClosedOrZero ? 'confirm-btn-disabled cursor-not-allowed' : 'confirm-btn cursor-pointer'}`;
	const fundButtonClasses = `flex flex-row justify-center space-x-5 items-center py-3 text-lg text-white ${disableOrEnable}`;

	// Methods
	async function fundBounty() {
		setIsLoading(true);
		const volumeInWei = volume * 10 ** token.decimals;

		if (volumeInWei == 0) {
			setError({ title: 'Zero Volume Sent', message: 'Must send a greater than 0 volume of tokens.' });
			setShowErrorModal(true);
			setIsLoading(false);
			setButtonText('Fund');
			return;
		}

		const bigNumberVolumeInWei = ethers.BigNumber.from(volumeInWei.toString());

		let approveSucceeded = false;

		try {
			const callerBalance = await appState.openQClient.balanceOf(library, account, token.address);

			if (callerBalance.lt(bigNumberVolumeInWei)) {
				const title = 'Funds Too Low';
				const message = 'You do not have sufficient funds for this deposit';
				setError({ message, title });
				setIsLoading(false);
				setShowErrorModal(true);
				return;
			}
		} catch (error) {
			console.log(error);
			const title = 'Error';
			const message = 'A contract call exception occurred';
			setError({ message, title });
			setIsLoading(false);
			setButtonText('Fund');
			setShowErrorModal(true);
			return;
		}

		try {
			if (token.address != ethers.constants.AddressZero) {
				setButtonText('Approving');
				await appState.openQClient.approve(
					library,
					bounty.bountyAddress,
					token.address,
					bigNumberVolumeInWei
				);
			}
			approveSucceeded = true;
		} catch (error) {
			const { message, title } = appState.openQClient.handleError(error, { bounty });
			setError({ message, title });
			setIsLoading(false);
			setButtonText('Fund');
			setShowErrorModal(true);
		}

		if (approveSucceeded) {
			setButtonText('Transferring');
			try {
				const fundTxnReceipt = await appState.openQClient.fundBounty(
					library,
					bounty.bountyAddress,
					token.address,
					bigNumberVolumeInWei,
					depositPeriodDays
				);
				setTransactionHash(fundTxnReceipt.transactionHash);
				setSuccessMessage(
					`Successfully funded issue ${bounty.url} with ${volume} ${token.symbol}!`
				);
				setShowSuccessModal(true);
				refreshBounty();
				setButtonText('Fund');
				setIsLoading(false);
			} catch (error) {
				const { message, title } = appState.openQClient.handleError(error, { bounty });
				setError({ message, title });
				setIsLoading(false);
				setButtonText('Fund');
				setShowErrorModal(true);
			}
		}
	}

	function onCurrencySelect(token) {
		setToken(token);
	}

	function onVolumeChange(volume) {
		setVolume(volume);
	}

	//Close Modal on outside click
	/* useEffect(() => {
		let handler = (event) => {
			if (!menuRef.current.contains(event.target)) {
				if (!isLoading) {
					if (!notifyMenuRef.current.contains(event.target)) {
						setIsLoading(false);
						updateModal();
					}
				} else {
					updateModal();
				}
			}
		};
		window.addEventListener("mousedown", handler);

		return () => {
			window.removeEventListener("mousedown", handler);
		};
	}); */

	// Render
	if (claimed) {
		return (
			<div className="pt-16">
				<div className="flex flex-col space-y-5">
					<div className="bg-purple-600 col-span-3 bg-opacity-20 border border-purple-700 rounded-lg text-white p-4">
						Bounty Is Already Closed
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className="flex flex-1 font-mont justify-center items-center">
				<div className="flex flex-col space-y-5 w-5/6">
					<div className="flex text-3xl font-semibold text-white justify-center pt-16">
						Fund Bounty
					</div>
					<div className="bg-purple-600 col-span-3 bg-opacity-20 border border-purple-700 rounded-lg text-white p-4">
						Deposited ERC-20 Tokens can be withdrawn again after 30 days
					</div>

					<TokenFundBox
						onCurrencySelect={onCurrencySelect}
						onVolumeChange={onVolumeChange}
						token={token}
						volume={volume}
					/>

					<div className="flex w-full flex-row justify-between items-center pl-14 py-3 rounded-lg py-1 bg-dark-mode border border-web-gray text-white">
						<h1 className='text-white'>Deposit Period Days</h1>
						<div className={'px-4 font-bold fundBox-amount bg-dark-mode'}>
							<input
								className="font-semibold text-2xl number outline-none bg-dark-mode w-full"
								autoComplete="off"
								value={depositPeriodDays}
								id="deposit-period"
								onChange={(event) => setDepositPeriodDays(event.target.value)}
							/>
						</div>
					</div>

					<div>
						<button
							className={fundButtonClasses}
							disabled={isLoading || claimed || parseInt(volume) == 0 || volume == ''}
							type="button"
							onClick={() => {
								setConfirmationMessage(
									`You are about to fund this bounty at address ${bounty.bountyAddress.substring(
										0,
										12
									)}...${bounty.bountyAddress.substring(32)} with ${volume} ${token.name
									}.
									
									This will be refundable after ${depositPeriodDays} ${depositPeriodDays == 1 ? 'day' : 'days'}.
									
									Is this correct?`
								);
								setShowConfirmationModal(true);
							}}
						>
							<div>{buttonText}</div>
							<div>{isLoading && <ButtonLoadingIcon />}</div>
						</button>
					</div>
					{/*  <div className="flex items-center justify-end p-6 border-solid border-blueGray-200 rounded-b">
								<button
									className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
									type="button"
									onClick={() => updateModal()}
								>
									Close
								</button>
							</div> */}
				</div>

				<ConfirmErrorSuccessModalsTrio
					setShowErrorModal={setShowErrorModal}
					showErrorModal={showErrorModal}
					error={error}
					setShowConfirmationModal={setShowConfirmationModal}
					showConfirmationModal={showConfirmationModal}
					confirmationTitle={'Confirm Deposit'}
					confirmationMessage={confirmationMessage}
					positiveOption={'Approve'}
					confirmMethod={fundBounty}
					showSuccessModal={showSuccessModal}
					setShowSuccessModal={setShowSuccessModal}
					successMessage={successMessage}
					transactionHash={transactionHash}
				/>
			</div>
		);
	}
};

export default FundPage;
