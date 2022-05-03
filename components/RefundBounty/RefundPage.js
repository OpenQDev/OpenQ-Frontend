// Third party
import React, { useState, useContext, useEffect } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import { ethers } from 'ethers';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import DepositCard from './DepositCard';
import BountyClosed from '../BountyClosed/BountyClosed';
import useEns from '../../hooks/useENS';
import ApproveTransferModal from '../FundBounty/ApproveTransferModal';
import {
	RESTING,
	CONFIRM,
	APPROVING,
	SUCCESS,
	ERROR
} from '../FundBounty/ApproveTransferState';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';

const RefundPage = ({ bounty, refreshBounty }) => {
	const [error, setError] = useState('');
	const [transactionHash, setTransactionHash] = useState(null);
	const [confirmationMessage, setConfirmationMessage] = useState('');
	const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
	const [approveTransferState, setApproveTransferState] = useState(RESTING);
	const [showApproveTransferModal, setShowApproveTransferModal] = useState(false);

	// Context
	const [appState] = useContext(StoreContext);
	const { library, account, } = useWeb3();
	const [ensName] = useEns(account);

	const claimed = bounty.status == 'CLOSED';

	// Side Effects
	useEffect(() => {
		if (bounty) {
			setConfirmationMessage(
				`You are about to refund your deposits on issue ${bounty.url} to the address ${ensName || account}. Is this correct ?`
			);
		}
	}, [bounty]);

	const resetState = () => {
		setShowApproveTransferModal(false);
		setApproveTransferState(CONFIRM);
	};

	// Methods
	async function refundBounty() {
		setApproveTransferState(APPROVING);
		const depositId = showApproveTransferModal;
		appState.openQClient
			.refundDeposit(library, bounty.bountyId, depositId)
			.then((txnReceipt) => {
				setTransactionHash(txnReceipt.transactionHash);
				const refundedDeposit = bounty.deposits.filter((deposit=>{return deposit.id = depositId}))[0];
				await appState.githubBot.funded({ bountyId: bounty.bountyId, deposit: refundedDeposit});
				setApproveTransferState(SUCCESS);
				refreshBounty();
			})
			.catch((error) => {
				const { message, title } = appState.openQClient.handleError(error, { account, bounty });
				setError({ message, title });
				setApproveTransferState(ERROR);
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
				<div className="flex justify-center items-center pl-5 pr-5 md:pl-16 md:pr-16 pt-10 pb-10 my-16 border-web-gray border rounded-lg w-5/6 max-w-6xl">
					<div className="flex flex-col space-y-5 w-full">
						<h1 className="font-bold py-4 text-2xl border-web-gray border-b text-white">
							Your Deposits
						</h1>
						<h2 className='text-white font-semibold'>Refundable</h2>
						<div className='flex flex-wrap gap-8'>
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
												<DepositCard deposit={deposit} status="refundable" bounty={bounty} refundBounty={() => {
													setConfirmationMessage(
														`You are about to refund the bounty at ${bounty.bountyAddress.substring(
															0,
															12
														)}...${bounty.bountyAddress.substring(32)}		Are you sure you want to refund this deposit?`
													);
													setApproveTransferState(CONFIRM);
													setShowApproveTransferModal(deposit.id);
												}}
												isOnCorrectNetwork={isOnCorrectNetwork} />
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
						<div className='flex flex-wrap gap-8'>
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
					{showApproveTransferModal && <ApproveTransferModal
						approveTransferState={approveTransferState}
						address={account}
						transactionHash={transactionHash}
						confirmationMessage={confirmationMessage}
						error={error}
						setShowApproveTransferModal={setShowApproveTransferModal}
						positiveOption={'Yes, Refund!'}
						confirmMethod={refundBounty}
						resetState={resetState}
						approvingMessage={'Refunding...'}
						approvingTitle={'Refund'}
					/>}
				</div>
			</>
		);
	}
};

export default RefundPage;
