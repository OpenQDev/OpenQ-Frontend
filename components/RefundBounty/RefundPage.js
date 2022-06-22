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

const RefundPage = ({ bounty, refreshBounty, internalMenu }) => {
	const [error, setError] = useState('');
	const [transactionHash, setTransactionHash] = useState(null);
	const [confirmationMessage, setConfirmationMessage] = useState('');
	const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
	const [approveTransferState, setApproveTransferState] = useState(RESTING);
	const [showApproveTransferModal, setShowApproveTransferModal] = useState(false);
	const [extend, setExtend] = useState(false);
	const [depositPeriodDays, setDepositPeriodDays] = useState(0);

	const onDepositPeriodChanged = (e) => {
		if (parseInt(e.target.value) >= 0) setDepositPeriodDays(parseInt(e.target.value));
		if (e.target.value === '') setDepositPeriodDays('0');
	};

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

		try{
			const txnReceipt = await	appState.openQClient.refundDeposit(library, bounty.bountyId, depositId);
			setTransactionHash(txnReceipt.events[0].transactionHash);

			try{
				setApproveTransferState(SUCCESS);
				refreshBounty();
			}
			catch(error){
				console.log(error);
			}
			
		}
	
		catch(error){
			const { message, title } = appState.openQClient.handleError(error, { account, bounty });
			setError({ message, title });
			setApproveTransferState(ERROR);
		}
	}

	async function extendBounty() {
		setApproveTransferState(APPROVING);
		const depositId = showApproveTransferModal;

		try{
			const txnReceipt = await	appState.openQClient.extendDeposit(library, bounty.bountyId, depositId, depositPeriodDays);
			setTransactionHash(txnReceipt.events[0].transactionHash);

			try{
				setApproveTransferState(SUCCESS);
				refreshBounty();
			}
			catch(error){
				console.log(error);
			}
			
			const deposits = bounty.deposits.filter((deposit)=>{
				return deposit.id !== depositId;
			});
			const tokenVolumes = await appState.tokenClient.parseTokenValues(deposits);
			const tvl = tokenVolumes.total;
			await appState.openQPrismaClient.updateBounty(bounty.bountyAddress, tvl);
		}
	
		catch(error){
			const { message, title } = appState.openQClient.handleError(error, { account, bounty });
			setError({ message, title });
			setApproveTransferState(ERROR);
		}
	}
	// Render

	return (
		<>{claimed?
			<>{internalMenu === 'Refund' && <BountyClosed bounty={bounty}/>}</> :
			<div className={`flex justify-center items-center pl-5 pr-5 md:pl-16 md:pr-16 pt-10 pb-10 my-16 border-web-gray border rounded-lg w-5/6 max-w-6xl ${internalMenu !== 'Refund'? 'hidden': null}`}>
				<div className="flex flex-col space-y-5 w-full">
					<h1 className="font-bold py-4 text-2xl border-web-gray border-b ">
							Your Deposits
					</h1>
					<div className='text-tinted font-bold text-center'>To see your deposits, connect the wallet that funded them.</div>
					<h2 className=' font-semibold'>Refundable</h2>
					<div className='flex flex-wrap gap-8'>
						{
							bounty.deposits &&	bounty.deposits
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
											<DepositCard deposit={deposit} status="refundable" bounty={bounty} 
											onDepositPeriodChanged={onDepositPeriodChanged} depositPeriodDays={depositPeriodDays}
											refundBounty={() => {
												setConfirmationMessage(
													`You are about to refund the bounty at ${bounty.bountyAddress.substring(
														0,
														12
													)}...${bounty.bountyAddress.substring(32)}	Are you sure you want to refund this deposit?`
												);
												setExtend(false);
												setApproveTransferState(CONFIRM);
												setShowApproveTransferModal(deposit.id);
											}}
											
											extendBounty={() => {
												setConfirmationMessage(
													`You are about to extend the bounty at ${bounty.bountyAddress.substring(
														0,
														12
													)}...${bounty.bountyAddress.substring(32)} by ${depositPeriodDays} ${depositPeriodDays == 1 ? 'day' : 'days'}.	Are you sure you want to extend this deposit?`
												);
												setExtend(true);
												setApproveTransferState(CONFIRM);
												setShowApproveTransferModal(deposit.id);
											}}
											isOnCorrectNetwork={isOnCorrectNetwork} />
										</div>
									);
								})
						}
					</div>
					<h2 className=' font-semibold'>Not Yet Refundable</h2>
					<div className='flex flex-wrap gap-8'>
						{
							bounty.deposits &&		bounty.deposits
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
					<h2 className=' font-semibold'>Refunded</h2>
					<div className='flex flex-wrap gap-8'>
						{
							bounty.deposits &&		bounty.deposits
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
					transactionHash={transactionHash}
					confirmationMessage={confirmationMessage}
					error={error}
					setShowApproveTransferModal={setShowApproveTransferModal}
					positiveOption={!extend? 'Yes, Refund!' : 'Yes, Extend!'}
					confirmMethod={!extend? refundBounty : extendBounty}
					resetState={resetState}
					approvingMessage={!extend? 'Refunding...' : 'Extending...'}
					approvingTitle={!extend? 'Refund' : 'Extend'}
					/>}
			</div>
		}</>
	);
	
};
export default RefundPage;
