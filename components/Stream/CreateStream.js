import React, { useState, useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useWeb3 from '../../hooks/useWeb3';
import ApproveStreamModal from './ApproveStreamModal';
import { APPROVING, ERROR, SUCCESS, TRANSFERRING } from '../FundBounty/ApproveTransferState';
import FundStreamModal from './FundStreamModal';

const CreateStream = () => {
	// CONTEXT
	const [appState] = useContext(StoreContext);
	const [txnHash, setTxnHash] = useState('');
	const [error, setError] = useState({});
	const { account, library } = useWeb3();

	// STATE
	const [showModal, setShowModal] = useState('');
	const [approveTransferState, setApproveTransferState] = useState('CONFIRM');

	const token =  {
		name: 'Dai',
		address: '0xc6A3cE73483Eb37B0ed46a63cF6c0705cE74c8B9',
		symbol: 'DAI',
		decimals: 18,
		chainId: 80001,
		path: '/crypto-logos/DAI.svg'
	};


	async function fund(volume, token){
		try{
			setApproveTransferState(APPROVING);
			const tx = await appState.superfluidClient.approve(library,  token.address, (volume).toString());
			await appState.superfluidClient.upgradeToken(library, token.address, (volume).toString()); 
			setTxnHash(tx.hash);
			setApproveTransferState(SUCCESS);
		}catch (error) {
			console.log(error);
			setApproveTransferState(ERROR);
			const { message, title } = appState.openQClient.handleError(error);
			setError({message, title});
		}

	}
	async function approveToken(volume,  recipient, flowRate, type) {
		try {
			await appState.superfluidClient.approve(library, token.address, volume);
			
			
			setApproveTransferState(TRANSFERRING);
			await stream(recipient, flowRate, type);
		} catch (error) {
			console.log(error);
			setApproveTransferState(ERROR);
			const { message, title } = appState.openQClient.handleError(error);
			setError({message, title});
		}
	}

	const approve = async(recipient, flowRate, type)=>{
		const volume = (parseFloat(flowRate) * 30).toString();
		setApproveTransferState(APPROVING);
		try{
			await	approveToken(volume, recipient, flowRate, type);
		}
		catch(err){
			setApproveTransferState(ERROR);
			const { message, title } = appState.openQClient.handleError(err);
			console.log(message, title);
			setError({message, title});
		}
	};

	const stream = async(recipient,  flowRate, type)=>{
		switch(type){

		case 'create':
			await	createNewFlowAndUpgrade(recipient,  flowRate);
			break;
		case 'update':
			await updateFlow(recipient, flowRate);
			break;			
		case 'delete':
			await deleteFlow(recipient);
			break;
		}
	};

	async function createNewFlowAndUpgrade(recipient, flowRate) {
		try {
			const tx = await appState.superfluidClient.upgradeAndCreateFlowBacth(
				library,
				token.address,
				flowRate,
				account,
				recipient
			);
			await tx.wait();
			console.log(tx);
			setTxnHash(tx.hash);
			
			setApproveTransferState(SUCCESS);
		} catch (error) {
			const { message, title } = appState.openQClient.handleError(error, recipient);
			setError({message, title});
			console.error(error);
			setApproveTransferState(ERROR);

		}
	}

	async function updateFlow(recipient, flowRate) {
		try {
			const tx = await appState.superfluidClient.updateFlow(
				library,
				account,
				recipient,
				flowRate,
				token.address,
			);
			console.log('Updating your stream...');
			await tx.wait();
			console.log(tx);
			setTxnHash(tx.hash);
			setApproveTransferState(SUCCESS);
		} catch (error) {
			const { message, title } = appState.openQClient.handleError(error, recipient);
			setError({message, title});
			console.log(
				'Hmmm, your transaction threw an error. Make sure that this stream does exist, and that you\'ve entered a valid Ethereum address!'
			);
			console.error(error);
			
			setApproveTransferState(ERROR);
		}
	}

	async function deleteFlow(recipient) {
		setApproveTransferState(TRANSFERRING);
		try {
			const tx = await appState.superfluidClient.deleteFlow(
				library,
				account,
				recipient,
				token.address,
			);
			console.log('Deleting your stream...');
			await tx.wait();
			console.log(tx);
			setApproveTransferState(SUCCESS);
		} catch (error) {			
			const { message, title } = appState.openQClient.handleError(error, recipient);
			console.error(error);
			setError({message, title});
			setApproveTransferState(ERROR);
		}
	}

	return (
		<div className="grid grid-cols-[1fr_1fr_1fr] gap-8 w-full rounded-lg justify-center justify-items-center pt-8">
			<div className='bg-inactive-gray text-center w-80 p-4 rounded-lg'>
				<h1 className='font-bold text-xl pb-6'>Stream Monthly</h1>
				<p className='pb-4'>Stream tokens every month to any Polygon address.</p>
				<button onClick={()=>setShowModal('create')} className='sm-confirm-btn'>Create Stream</button>
			</div>
			<div className='bg-inactive-gray text-center w-80 p-4 rounded-lg'>
				<h1 className='font-bold text-xl pb-6'>Update Stream</h1>
				<p className='pb-4'>Change the flow rate of an existing stream.</p>
				<button onClick={()=>setShowModal('update')} className='sm-confirm-btn'>Update Stream</button>
			</div>
			<div className='bg-inactive-gray text-center w-80 p-4 rounded-lg'>
				<h1 className='font-bold text-xl pb-6'>Delete Stream</h1>
				<p className='pb-10'>Cancel an existing stream.</p>
				<button onClick={()=>setShowModal('delete')} className='sm-confirm-btn'>Delete Stream</button>
			</div>
			
			<div className='bg-inactive-gray text-center w-80 p-4 rounded-lg'>
				<h1 className='font-bold text-xl pb-6'>Fund Stream</h1>
				<p className='pb-10'>Top up your stream with more tokens.</p>
				<button onClick={()=>setShowModal('fund')} className='sm-confirm-btn'>Fund Stream</button>
			</div>
			<div className='w-2/4 flex flex-col gap-4 pt-16'>


				{showModal === 'fund' ?
					<FundStreamModal resetState={() => { setShowModal(false); setApproveTransferState('CONFIRM'); }}
						transactionHash={txnHash}
						showModal={showModal} 
						setShowApproveTransferModal={setShowModal} 
						fund={fund} 
						approveTransferState={approveTransferState} 
						error={error}  />
					: showModal && 
					<ApproveStreamModal
						resetState={() => { setShowModal(false); setApproveTransferState('CONFIRM'); }}
						transactionHash={txnHash}
						deleteFlow={deleteFlow}
						showModal={showModal}
						setShowApproveTransferModal={setShowModal}
						approveTransferState={approveTransferState}
						confirmMethod={approve}
						error={error}
						token={token} />
				}
	
			</div></div>
	);
};

export default CreateStream;