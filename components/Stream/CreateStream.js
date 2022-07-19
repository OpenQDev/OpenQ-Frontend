import React, { useState, useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useWeb3 from '../../hooks/useWeb3';
import { ethers } from 'ethers';
import ApproveStreamModal from './ApproveStreamModal';
import { APPROVING, ERROR, SUCCESS, TRANSFERRING } from '../FundBounty/ApproveTransferState';
import TokenFundBox from '../FundBounty/SearchTokens/TokenFundBox';
import { flow } from 'lodash';

const CreateStream = () => {
	// CONTEXT
	const [appState] = useContext(StoreContext);
	const [txnHash, setTxnHash] = useState('');
	const [error, setError] = useState({});
	const { account, library } = useWeb3();

	// STATE
	const [isButtonLoading, setIsButtonLoading] = useState(false);
	const [showModal, setShowModal] = useState('');
	const [approveTransferState, setApproveTransferState] = useState('CONFIRM');
	const [volume, setVolume] = useState('');

	const [fDaiAddress, setFDaiAddress] = useState('');
	const [fDaiXAddress, setFDaiXAddress] = useState(process.env.NEXT_PUBLIC_FDAIX_ADDRESS);
	
	const zeroAddressMetadata = {
		name: 'fDaiX',
		address: '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f',
		symbol: 'FDAIX',
		decimals: 18,
		chainId: 80001,
		path: '/crypto-logos/FDAIX.svg'
	};
	const [token, setToken] = useState(zeroAddressMetadata);

	async function approveToken(volume, callback) {
		console.log(fDaiXAddress, volume);
		try {
			return	await appState.superfluidClient.approve(library, fDaiXAddress, volume);
		} catch (error) {
			console.log(error);
			callback();
		}
	}

	const approve = async(recipient, flowRate, type)=>{
		console.log(flowRate);
		const volume = (flowRate * 30).toString();
		setApproveTransferState(APPROVING);
		try{
			await	approveToken(volume, () => {
				setIsButtonLoading(false);
				setVolume('');
			});
			setApproveTransferState(TRANSFERRING);
			await stream(recipient, flowRate, type);
		}
		catch(err){
			const { message, title } = appState.openQClient.handleError(err);
			setError({message, title});
		}
	};

	const stream = async(recipient,  flowRate, type)=>{
		console.log(recipient);
		switch(type){

		case 'create':
			await	createNewFlowAndUpgrade(recipient,  flowRate);
			break;
		case 'update':
			await updateFlow(recipient, flowRate);
			break;
		}
	};

	async function createNewFlowAndUpgrade(recipient, flowRate) {
		try {
			const tx = await appState.superfluidClient.upgradeAndCreateFlowBacth(
				library,
				fDaiXAddress,
				flowRate,
				account,
				recipient
			);
			console.log('Creating your stream...');
			await tx.wait();
			console.log(tx);
			setTxnHash(tx.hash);
			console.log(
				`Congrats - you've just created a money stream!
				View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
				Network: Mumbai
				Super Token: fDAIx
				Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
				Receiver: ${recipient}`

			);
			
			setApproveTransferState(SUCCESS);
		} catch (error) {
			const { message, title } = appState.openQClient.handleError(error);
			setError({message, title});
			console.log(
				'Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you\'ve entered a valid Ethereum address!'
			);
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
				fDaiXAddress,
			);
			console.log('Updating your stream...');
			await tx.wait();
			console.log(tx);
			setTxnHash(tx.hash);
			console.log(
				`Congrats - you've just updated a money stream!
				View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
				Network: Mumbai
				Super Token: DAIx
				Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
				Receiver: ${recipient}`
			);
			
			setApproveTransferState(SUCCESS);
		} catch (error) {
			const { message, title } = appState.openQClient.handleError(error);
			setError({message, title});
			console.log(
				'Hmmm, your transaction threw an error. Make sure that this stream does exist, and that you\'ve entered a valid Ethereum address!'
			);
			console.error(error);
			
			setApproveTransferState(ERROR);
		}
	}

	async function deleteFlow(recipient, ) {
		try {
			const tx = await appState.superfluidClient.deleteFlow(
				library,
				account,
				recipient,
				fDaiXAddress,
			);
			console.log('Deleting your stream...');
			await tx.wait();
			console.log(tx);
			console.log(
				`Congrats - you've just deleted a money stream!
				check it at: https://app.superfluid.finance/dashboard/${recipient}
				Network: Mumbai
				Super Token: DAIx
				Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
				Receiver: ${recipient},`
			);
		} catch (error) {
			console.log(
				'Hmmm, your transaction threw an error. Make sure that this stream  exist, and that you\'ve entered a valid Ethereum address!'
			);
			console.error(error);
		}
	}

	function CreateButton({ children, ...props }) {
		return (
			<button
				variant="success"
				className="mb-5 text-lg rounded-full inline-flex items-center justify-center px-3 py-2 border-2 border-secondary-900 bg-secondary-900"
				disabled={isButtonLoading}
				{...props}
			>
				{children}
			</button>
		);
	}


	const handleVolumeChange = (e) => {
		setVolume(e.target.value);
	};

	const handleAddressChange = (e) => {
		setFDaiAddress(e.target.value);
	};

	const handleAddressChangefDaix = (e) => {
		setFDaiXAddress(e.target.value);
	};

	return (
		<div className="grid grid-cols-[1fr_1fr_1fr] gap-8 w-full rounded-lg pt-8">
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
				<p className='pb-10'>Cancel flow of an existing Stream.</p>
				<button onClick={()=>setShowModal('delete')} className='sm-confirm-btn'>Delete Stream</button>
			</div>
			
			<div className='bg-inactive-gray text-center w-80 p-4 rounded-lg'>
				<h1 className='font-bold text-xl pb-6'>Fund Stream</h1>
				<p className='pb-10'>Top up your stream with more tokens.</p>
				<button onClick={()=>setShowModal('delete')} className='sm-confirm-btn'>Delete Stream</button>
			</div>
			<div className='w-2/4 flex flex-col gap-4 pt-16'>


				{showModal&&<ApproveStreamModal resetState={()=>{setShowModal(false); setApproveTransferState('CONFIRM');}} 
					transactionHash={txnHash}
					stream={stream}
					showModal={showModal} setShowApproveTransferModal={setShowModal} confirmMethod={approve} approveTransferState={approveTransferState} error={error} const token ={token}/>}
				<button className={(!volume  ) ? 'confirm-btn-disabled': 'confirm-btn'} disabled={!volume } onClick={()=>setShowModal(true)}>Show modal</button>
	
			</div></div>
	);
};

export default CreateStream;