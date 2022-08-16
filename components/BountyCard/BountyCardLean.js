// Third party
import React, { useState, useContext } from 'react';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import BountyCardDetailsModal from './BountyCardDetailsModal';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import LabelsList from '../Bounty/LabelsList';

const BountyCardLean = ({ bounty, loading, index, length, unWatchable }) => {
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
		<div className={loading ? 'pointer-events-none cursor-normal relative w-full' : 'w-full'}>
			<BountyCardDetailsModal unWatchable={unWatchable} TVL={TVL} bounty={bounty} closeModal={closeModal} showModal={isModal && bounty} tokenValues={tokenValues} />
			<div onClick={openModal}
				className={
					`flex flex-col  md:px-4 py-4 border-web-gray cursor-pointer ${index!==length-1 && 'border-b'}`
				}
			>
				<div className="flex flex-row justify-between sm:pt-0 text-primary">
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
							<div data-testid="title" className="break-word text-xl text-link-colour inline gap-1 pb-1">
								<span>
									{	bounty.owner && `${bounty.owner.toLowerCase()}/${bounty.repoName.toLowerCase()}`}
								</span>
								<span >
								</span>
							</div>
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
						<LabelsList bounty={bounty}/>
						<div className="flex flex-row items-center gap-4 text-muted font-semibold">
							<span><svg xmlns="http://www.w3.org/2000/svg" 
								className={'stroke-muted inline-block mr-1 -mt-1 fill-muted'} viewBox="0 0 16 16" width="16" height="16"><path d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z">
								</path>
							</svg>	
							<span>{0}
							</span></span>
							

							<span>Assigned to {bounty.assignees.nodes[0]?.name|| 'no one.'}</span>
							{bounty.assignees.nodes[0]?.avatarUrl &&	<Image height={24} width={24} className='rounded-full pt-1' src={bounty.assignees.nodes[0]?.avatarUrl}/>}
						</div>
						
					</div>
			
			
				

					{loading ?
						<Skeleton width={60} /> :
						<div className='flex flex-col justify-between items-end leading-tight '>
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
								<div className="pr-2 pt-1 invisible md:visible">
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
