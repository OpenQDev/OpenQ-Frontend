// Third party Libraries
import React, { useState, useEffect, useContext } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import { ethers } from 'ethers';
import TokenFundBox from '../FundBounty/SearchTokens/TokenFundBox';

const AdminPage = ({ bounty, refreshBounty }) => {

	// Context
	const { library, account, } = useWeb3();
	const [appState, dispatch] = useContext(StoreContext);
	const zeroAddressMetadata = {
		name: 'Matic',
		address: '0x0000000000000000000000000000000000000000',
		symbol: 'MATIC',
		decimals: 18,
		chainId: 80001,
		path: 'https://wallet-asset.matic.network/img/tokens/matic.svg'
	};

	// State
	const [error, setError] = useState('');
	const [showButton, setShowButton] = useState(ethers.utils.getAddress(bounty.issuer.id) == account && !bounty.bountyClosedTime)
	const [volume, setVolume] = useState('');
	const [token, setToken] = useState(zeroAddressMetadata);

	async function closeCompetition() {
		try {
			await appState.openQClient.closeCompetition(library, bounty.bountyId);
			setShowButton(false);
			refreshBounty();
		} catch (error) {
			console.log(error);
			const { message, title } = appState.openQClient.handleError(error, { bounty });
			setError({ message, title });
			console.log({ message, title });
		}
	}

	async function closeOngoing() {
		try {
			await appState.openQClient.closeOngoing(library, bounty.bountyId);
			setShowButton(false);
			refreshBounty();
		} catch (error) {
			console.log(error);
			const { message, title } = appState.openQClient.handleError(error, { bounty });
			setError({ message, title });
			console.log({ message, title });
		}
	}

	function onCurrencySelect(token) {
		setToken({ ...token, address: ethers.utils.getAddress(token.address) });
	}

	function onVolumeChange(volume) {
		appState.utils.updateVolume(volume, setVolume);
	}

	function setBudget() {
		alert('please set this function to actually change Budget for this issue')
	}

	if (showButton) {
		return (
			<>
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
			</>)
	} else {
		return <></>;
	}



};

export default AdminPage;
