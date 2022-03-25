// Third Party
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import BountyCardHeader from './BountyCardHeader';
import LabelsList from './LabelsList';
import BountyStatus from './BountyStatus';
import BountyLinks from './BountyLinks';
import TokenBalances from '../TokenBalances/TokenBalances';


const BountyCardDetailsModal = ({ bounty, TVL, closeModal, tokenValues}) => {
	const modal = useRef();
	useEffect(() => {
		// Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
		function handleClickOutside(event) {
			if (modal.current && !modal.current.contains(event.target)) {
				closeModal();
				
			}
		}

		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [modal]);

	return (
		<div className='flex justify-center items-center bg-black/70 inset-0 z-20 fixed text-white py-4 overflow-hidden z-30'>
			<div ref={modal} className="bg-dark-mode w-5/6 h-min rounded-lg lg:w-2/3 max-w-3xl text-lg relative overflow-hidden">
				<div className="px-8 pt-4">
					<BountyCardHeader bounty={bounty} />
				</div>					
				<div className="px-8 py-4 max-h-[80vh] overflow-y-auto">
					<div className="text-base">
						<BountyStatus bounty={bounty} />
					</div>
					<Link href={`/bounty/${bounty.bountyAddress}`}>link</Link>
					<div className="flex justify-between pb-4">
						{bounty.labels.length>0 && 
						<LabelsList bounty={bounty} />}
						<p className="font-bold pt-4 whitespace-nowrap">
							TVL: {TVL}
						</p>
					</div>
					{tokenValues &&<div className="flex gap-4 pb-8">
						<div className="border border-web-gray px-4 pb-1 w-max rounded-md">
							<TokenBalances tokenBalances={bounty.bountyTokenBalances} tokenValues={tokenValues} showOne={true}/>						
						</div>
						<Link href={`/bounty/${bounty.bountyAddress}`}>
							<div className="border border-web-gray px-4 pb-1 pt-1 w-max rounded-md cursor-pointer">more...
							</div>
						</Link>
					</div>}
					<section className="github_markup" dangerouslySetInnerHTML={{ __html: bounty.bodyHTML }}></section>
				</div>
				<div className="sticky w-full bg-black overflow-hidden rounded-b-lg p-4">
					<BountyLinks bounty={bounty}/>
				</div>
			</div>
		</div>
	);
};

export default BountyCardDetailsModal;
