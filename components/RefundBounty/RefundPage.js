// Third Party
import React, { useState, useContext, useEffect } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import { ethers } from 'ethers';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import ConfirmErrorSuccessModalsTrio from '../ConfirmErrorSuccessModals/ConfirmErrorSuccessModalsTrio';
import useConfirmErrorSuccessModals from '../../hooks/useConfirmErrorSuccessModals';
import LoadingIcon from '../Loading/LoadingIcon';
import DepositCard from './DepositCard';
import BountyClosed from '../BountyClosed/BountyClosed';

const RefundPage = ({ bounty, refreshBounty }) => {
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
	const [successMessage, setSuccessMessage] = useState('');
	const [transactionHash, setTransactionHash] = useState(null);
	const [confirmationMessage, setConfirmationMessage] = useState('');

	// Context
	const [appState] = useContext(StoreContext);
	const { library, account } = useWeb3();

	const claimed = bounty.status == 'CLOSED';

	useEffect(() => {
		if (bounty) {
			setConfirmationMessage(
				`You are about to refund your deposits on issue ${bounty.url} to the address ${account}. Is this correct ?`
			);
		}
	}, [bounty]);

	// Methods
	async function refundBounty(depositId) {
		setIsLoading(true);
		appState.openQClient
			.refundDeposit(library, bounty.bountyId, depositId)
			.then((txnReceipt) => {
				setTransactionHash(txnReceipt.transactionHash);
				setSuccessMessage('Money refunded!');
				setShowSuccessModal(true);
				refreshBounty();
				setIsLoading(false);
			})
			.catch((error) => {
				const { message, title } = appState.openQClient.handleError(error, { account, bounty });
				setError({ message, title });
				setIsLoading(false);
				setShowErrorModal(true);
			});
	}

	// Render
	if (claimed) {
		return (
			<BountyClosed bounty={bounty} />
		);
	} else {
		return (
			<>
				<div className="flex justify-center items-center pl-5 pr-5 md:pl-16 md:pr-16 pt-10 pb-10 my-16 border-web-gray border rounded-lg w-5/6">
					<div className="flex flex-col space-y-5 w-full">
						<h1 className="font-bold py-4 text-2xl border-web-gray border-b text-white">
							Your Deposits
						</h1>
						<h2 className='text-white font-semibold'>Refundable</h2>
						<div className='flex flex-wrap gap-8 flex-wrap'>
							{
								bounty.deposits
									.filter((deposit) => {
										return (ethers.utils.getAddress(deposit.sender.id) == account);
									})
									.filter((deposit) => {
										return deposit.refunded == false;
									})
									.filter((deposit) => {
										return ((parseInt(deposit.receiveTime) + parseInt(deposit.expiration)) < Math.floor(Date.now() / 1000));
									})
									.map((deposit) => {
										return (
											<div key={deposit.id}>
												<DepositCard deposit={deposit} status="refundable" bounty={bounty} refundBounty={refundBounty} />
											</div>
										);
									})
							}
						</div>
						<h2 className='text-white font-semibold'>Not Yet Refundable</h2>
						<div className='flex flex-wrap gap-8'>
							{
								bounty.deposits
									.filter((deposit) => {
										return (ethers.utils.getAddress(deposit.sender.id) == account);
									})
									.filter((deposit) => {
										return ((parseInt(deposit.receiveTime) + parseInt(deposit.expiration)) > Math.floor(Date.now() / 1000));
									})
									.map((deposit) => {
										return (
											<div key={deposit.id}>
												<DepositCard deposit={deposit} status="not-yet-refundable" bounty={bounty} refundBounty={refundBounty} />
											</div>
										);
									})
							}
						</div>
						<h2 className='text-white font-semibold'>Refunded</h2>
						<div className='flex flex-wrap gap-x-8'>
							{
								bounty.deposits
									.filter((deposit) => {
										return (ethers.utils.getAddress(deposit.sender.id) == account);
									})
									.filter((deposit) => {
										return (deposit.refunded == true);
									})
									.map((deposit) => {
										return (
											<div key={deposit.id}>
												<DepositCard deposit={deposit} status="refunded" bounty={bounty} refundBounty={refundBounty} />
											</div>
										);
									})
							}
						</div>
					</div>
					{isLoading && <LoadingIcon closeModal={()=>setIsLoading(false)}/>}
					<ConfirmErrorSuccessModalsTrio
						setShowErrorModal={setShowErrorModal}
						showErrorModal={showErrorModal}
						error={error}
						setShowConfirmationModal={setShowConfirmationModal}
						showConfirmationModal={showConfirmationModal}
						confirmationTitle={'Refund Deposits'}
						confirmationMessage={confirmationMessage}
						positiveOption={'Yes, Refund!'}
						confirmMethod={refundBounty}
						showSuccessModal={showSuccessModal}
						setShowSuccessModal={setShowSuccessModal}
						successMessage={successMessage}
						transactionHash={transactionHash}
					/>
				</div>
			</>
		);
	}
};

export default RefundPage;
