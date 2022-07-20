// Third party
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import BountyCardHeader from './BountyCardHeader';
import LabelsList from './LabelsList';
import BountyStatus from './BountyStatus';
import BountyLinks from './BountyLinks';
import TokenBalances from '../TokenBalances/TokenBalances';
import useWeb3 from '../../hooks/useWeb3';
import {StackIcon, LogIcon} from '@primer/octicons-react'

const BountyCardDetailsModal = ({ bounty, TVL, closeModal, tokenValues }) => {
	const modal = useRef();
	const { safe } = useWeb3();
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
		<div className='flex justify-center items-center bg-overlay inset-0 fixed  py-4 overflow-hidden z-30'>
			<div ref={modal} className="bg-dark-mode w-5/6 h-min rounded-sm lg:w-2/3 max-w-3xl text-lg relative overflow-hidden">
				<div className="px-8 pb-2 pt-6">
					<BountyCardHeader bounty={bounty} />
				</div>
				<div className="px-8 py-4 max-h-[60vh] overflow-y-auto">
				<div className='py-4'>
						<Link href={`/bounty/${bounty.id}/${bounty.bountyAddress}`} >
							<a onClick={closeModal} target={safe ? '_self' : '_blank'} rel="noopener noreferrer" ><div className='flex flex-row space-x-2 -mt-6 btn-default w-fit items-center text-sm'><StackIcon size={24} /><div>Full Bounty</div></div></a>
						</Link>
					</div>
					<div className="text-base">
						<BountyStatus bounty={bounty} />
					</div>
					<div className="flex justify-between pb-4">
						{bounty.labels.length > 0 &&
							<LabelsList bounty={bounty} />}
						<p className="font-bold pt-4 whitespace-nowrap">
							TVL: {TVL}
						</p>
					</div>
					{tokenValues && <div className="flex gap-4 pb-8 items-end">
						<div className="border border-web-gray px-4 pb-1 w-max rounded-md">
							<TokenBalances tokenBalances={bounty.bountyTokenBalances} tokenValues={tokenValues} showOne={true} />
						</div>
						{bounty.bountyTokenBalances?.length > 1 && <Link href={`/bounty/${bounty.id}/${bounty.bountyAddress}`}>
							<a onClick={closeModal} target={safe ? '_self' : '_blank'} rel="noopener noreferrer">
								<div onClick={closeModal} className="border border-web-gray px-4 pb-1.5 pt-1.5 w-max rounded-md cursor-pointer">more...
								</div>
							</a>
						</Link>}
					</div>}
					<section className="markdown-body" dangerouslySetInnerHTML={{ __html: bounty.bodyHTML }}></section>
					<div className='py-4'>
						<Link href={`/bounty/${bounty.id}/${bounty.bountyAddress}`} >
							<a onClick={closeModal} target={safe ? '_self' : '_blank'} rel="noopener noreferrer" ><div className='flex flex-row space-x-2 btn-default w-fit items-center'><LogIcon size={16}/><div>Read more</div></div></a>
						</Link>
					</div>
				</div>
				<div className="sticky w-full bg-black overflow-hidden rounded-b-lg p-4 h-14">
					<BountyLinks bounty={bounty} />
				</div>
			</div>
		</div>
	);
};

export default BountyCardDetailsModal;
