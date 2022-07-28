// Third party
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import MiniDepositCard from './MiniDepositCard';
import BountyStatus from './BountyStatus';
import BountyLinks from './BountyLinks';
import useWeb3 from '../../hooks/useWeb3';
import BountyModalHeading from './BountyModalHeading';
import { LogIcon } from '@primer/octicons-react';
import BountyMetadata from './BountyMetadata';
import TotalValue from './TotalValue';

const BountyCardDetailsModal = ({ bounty,  closeModal, tokenValues }) => {
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
		<div className='flex justify-center items-start bg-overlay inset-0 fixed py-8 md:py-8 overflow-y-scroll z-30'>
			<div ref={modal} className="bg-dark-mode pt-2 w-5/6 rounded-sm lg:w-2/3 max-w-3xl text-lg relative overflow-hidden">
				<BountyModalHeading  closeModal={closeModal} bounty={bounty}/>
				
				<div className='flex w-full justify-between px-8'>
					<BountyStatus  bounty={bounty} />
					
				</div>
				<TotalValue bounty={bounty} tokenValues={tokenValues}/>
				
				<div className="font-semibold text-primary text-base my-3 mx-4 sm:mx-8">Deposits</div>
				{tokenValues && <div className="flex flex-wrap gap-4 pb-6 items-end mx-4 sm:mx-8">
					{bounty.deposits && bounty.deposits
						.filter((deposit) => {
							return deposit.refunded == false;
						})
						.sort((a, b) => {
							return (parseInt(a.receiveTime) + parseInt(a.expiration)) - (parseInt(b.receiveTime) + parseInt(b.expiration));
						})
						.map((deposit, index) => <MiniDepositCard key={index} deposit={deposit} status={bounty.status} showLink={false} />
						)
					}
					{bounty.bountyTokenBalances?.length > 1 && <Link href={`/bounty/${bounty.id}/${bounty.bountyAddress}`}>
						<a onClick={closeModal} target={safe ? '_self' : '_blank'} rel="noopener noreferrer">
							<div onClick={closeModal} className="border border-web-gray px-4 pb-1.5 pt-1.5 w-max rounded-md cursor-pointer">more...
							</div>
						</a>
					</Link>}
				</div>}
				<div className='flex flex-wrap mx-4 sm:mx-8 pb-4 text-primary' >
					<div className=" flex-1 w-full py-4 border-web-gray border px-2 rounded-sm">
						
						<section className="markdown-body" dangerouslySetInnerHTML={{ __html: bounty.bodyHTML }}></section>
						<div className='py-4'>
							<Link href={`/bounty/${bounty.id}/${bounty.bountyAddress}`} >
								<a onClick={closeModal} target={safe ? '_self' : '_blank'} rel="noopener noreferrer" >
									<div className='flex flex-row space-x-2 btn-default text-sm w-fit items-center'>
										<LogIcon size={16}/>
										<div>Read more</div>
									</div>
								</a>
							</Link>
						</div>
					</div>
					<BountyMetadata bounty={bounty} price={0}/>
				</div>
				<div className="sticky w-full bg-black overflow-hidden rounded-b-sm p-4">
					<BountyLinks bounty={bounty} />
				</div>
			</div>
		</div>
	);
};

export default BountyCardDetailsModal;
