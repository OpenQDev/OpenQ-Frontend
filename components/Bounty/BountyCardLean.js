// Third party
import React, { useState, useContext } from 'react';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import BountyCardDetailsModal from './BountyCardDetailsModal';

// Custom
import StoreContext from '../../store/Store/StoreContext';

const BountyCardLean = ({ bounty, loading, index, length }) => {
	// State
	
	const bountyName = bounty?.title.toLowerCase() || '';
	const [appState] = useContext(StoreContext);
	const [isModal, setIsModal] = useState();
	// Hooks
	const [tokenValues] = useGetTokenValues(bounty?.bountyTokenBalances || []);
	const TVL = tokenValues != null && tokenValues != {}
		? appState.utils.formatter.format(tokenValues.total)
		: appState.utils.formatter.format(0);
	const closeModal = () => {
		setIsModal(false);
		document.body.style.height = 'auto';
		document.body.style.overflowY = 'auto';		
	};
	const openModal = () => {
		document.body.style.height = '100vh';
		document.body.style.overflowY = 'hidden';		
		setIsModal(true);
	}; 

	// Render
	return (
		<div className={loading ? 'pointer-events-none cursor-normal relative' : undefined}>
			{isModal && bounty && <BountyCardDetailsModal TVL={TVL} bounty={bounty} closeModal={closeModal} tokenValues={tokenValues} />}
			<div onClick={openModal}
				className={
					`flex flex-col  md:px-4 py-4 border-web-gray cursor-pointer ${index!==length-1 && 'border-b'}`
				}
			>
				<div className="flex flex-row justify-between sm:pt-0">
					<div className="w-3/4">
						<div className="flex flex-grow flex-row items-center md:space-x-2 sm:pb-0 w-full">
							<div className="hidden md:block">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill={loading ? '#333' : bounty.status === 'CLOSED' ? '#F0431D' : '#15FB31'}
									viewBox="0 0 16 16"
									width="19"
									height="19"
								>
									<path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
									<path
										fillRule="evenodd"
										d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
									></path>
								</svg>
							</div>
							{loading ? <Skeleton width={'100px'} /> : <div data-testid="title" className="text-xl text-link-colour pb-1">
								{	bounty.owner && `${bounty.owner.toLowerCase()}/${bounty.repoName.toLowerCase()}`}
							</div>}
						</div>
						<div className="font-bold text-lg">
							{loading ?
								<Skeleton width={'100px'} /> :
								bounty?.title.length < 50
									? bounty?.title.toLowerCase()
									: bountyName.slice(0, 50) + '...'}
						</div>
						
						<div className="flex flex-row items-center space-x-4 w-full">
							<div className="font-light text-sm w-full">

								{loading ?
									<Skeleton width={'100%'} /> :
									`Deployed: ${appState.utils.formatUnixDate(parseInt(bounty?.bountyMintTime))}`
								}
							</div>
						</div>
						<div className="flex flex-row items-center space-x-4">
							
						</div>
						
					</div>
			
			
				

					{loading ?
						<Skeleton width={60} /> :
						<div className='flex flex-col justify-between items-end leading-tight'>
							{bounty?.avatarUrl ?
								<Image className='rounded-full'
									src={bounty?.avatarUrl}
									alt="avatarUrl"
									width="51"
									height="51"
								/> :
								<Skeleton width={51} height={51} />
							}
							<div className="flex flex-row space-x-1 items-center">
								<div className="pr-2 pt-1">
									<Image
										src="/crypto-logos/ETH.svg"
										alt="avatarUrl"
										width="12"
										height="20"
									/>
								</div>

								<div className="font-semibold ">TVL</div>
								<div className="">
									{TVL}
								</div>

							
							</div>
						</div>}
				</div>
			</div>
		</div>
	);
};

export default BountyCardLean;
