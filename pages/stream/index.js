import React, { useState, useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useWeb3 from '../../hooks/useWeb3';
import { ethers } from 'ethers';
import ApproveFundModal from '../../components/FundBounty/ApproveFundModal';
import { APPROVING, ERROR, SUCCESS, TRANSFERRING } from '../../components/FundBounty/ApproveTransferState';
import TokenFundBox from '../../components/FundBounty/SearchTokens/TokenFundBox';

const stream = () => {
	// CONTEXT
	const [appState] = useContext(StoreContext);
	const [txnHash, setTxnHash] = useState('');
	const [error, setError] = useState({});
	const { account, library } = useWeb3();

	// STATE
	const [isButtonLoading, setIsButtonLoading] = useState(false);
	const [showModal, setShowModal] = useState();
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
		try {
			return	await appState.superfluidClient.approve(library, fDaiXAddress, volume);
		} catch (error) {
			console.log(error);
			callback();
		}
	}

	const approve = async()=>{
		setApproveTransferState(APPROVING);
		try{
			await	approveToken(volume, () => {
				setIsButtonLoading(false);
				setVolume('');
			});
			setApproveTransferState(TRANSFERRING);}
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

	async function deleteFlow(recipient, callback) {
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
			callback();
		} catch (error) {
			console.log(
				'Hmmm, your transaction threw an error. Make sure that this stream  exist, and that you\'ve entered a valid Ethereum address!'
			);
			console.error(error);
			callback();
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
	

	function onCurrencySelect(token) {
		setToken({ ...token, address: ethers.utils.getAddress(token.address) });
	}
	

	function onVolumeChange(volume) {
		const numberRegex = /^(\d+)?(\.)?(\d+)?$/;
		if (numberRegex.test(volume) || volume === '' || volume === '.') {
			setVolume(volume.match(numberRegex)[0]);
		}
	}

	return (
		<div className="flex flex-col items-center w-full">
		

			<TokenFundBox
				onCurrencySelect={onCurrencySelect}
				onVolumeChange={onVolumeChange}
				token={token}
				volume={volume}
			/>

			{showModal&&<ApproveFundModal resetState={()=>{setShowModal(false); setApproveTransferState('CONFIRM');}} 
				transactionHash={txnHash}
				stream = {stream} setShowApproveTransferModal={setShowModal} confirmMethod={approve} approveTransferState={approveTransferState} error={error} const token ={token}/>}
			<button className={(!volume  ) ? 'confirm-btn-disabled': 'confirm-btn'} disabled={!volume } onClick={()=>setShowModal(true)}>Show modal</button>
			<div className="ml-12">
				<h2 className="mb-5 text-2xl">
					FDAI Address
				</h2>
				<form>
					<div className="mb-5 text-black">
						<input
							type="text"
							name="fDaiAddress"
							value={fDaiAddress}
							onChange={handleAddressChange}
							placeholder="fDai Address"
							className="w-full h-8"
						/>
					</div>
				</form>
			</div>
			<div className="ml-12">
				<h2 className="mb-5 text-2xl">
					FDAIX Address
				</h2>
				<form>
					<div className="mb-5 text-black">
						<input
							type="text"
							name="fDaiXAddress"
							value={fDaiXAddress}
							onChange={handleAddressChangefDaix}
							placeholder="fDaiX Address"
							className="w-full h-8"
						/>
					</div>
				</form>
			</div>
			<div className="ml-12">
				<h2 className="mb-5 text-2xl">
					Approve Tokens
				</h2>
				<form>
					<CreateButton
						onClick={(e) => {
							e.preventDefault();
							setIsButtonLoading(true);
							approveToken(volume, () => {
								setIsButtonLoading(false);
								setVolume('');
							});
						}}
					>
						Approve the contract to move your tokens
					</CreateButton>
				</form>
			</div>
			<div>
				<h2 className="mb-3 text-2xl">
					Create a Flow
				</h2>
				<form>
					
					<div className="mb-3">
						<div>
							<p>Your flow will be equal to:</p>
						</div>
					</div>
				</form>
			</div>
			<div>
				<h2 className="mb-3 text-2xl">
					Update a Flow
				</h2>
				<form>
					
					<div className="mb-3">
						<div>
							<p>Your flow will be equal to:</p>
							<p> DAIx/day
							</p>
						</div>
					</div>
				</form>
			</div>
			<div>
				<h2 className="mb-3 text-2xl">
					Delete a Flow
				</h2>
				<form>
					
				</form>
			</div>
		</div>
	);
};

export default stream;