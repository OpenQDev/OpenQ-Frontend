// Third Party
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import TokenBalances from '../TokenBalances/TokenBalances';

// Custom
import BountyCardHeader from './BountyCardHeader';
import BountyLinks from './BountyLinks';
import BountyStatus from './BountyStatus';
import CopyBountyAddress from './CopyBountyAddress';
import LabelsList from './LabelsList';
import MiniDepositCard from './MiniDepositCard';


const BountyCardDetails = ({ bounty, tokenValues }) => {

	return (
		<div className="flex flex-col font-mont pl-5 pr-5 md:pl-16 md:pr-16 pt-10 pb-10 my-16 border-web-gray border rounded-lg w-5/6 max-w-6xl">
			<div className="flex flex-col border-b border-solid rounded-t gap-2">
				<BountyCardHeader bounty={bounty} />
				<div
					className="grid grid-cols-2 pt-5 justify-center 
				md:justify-between"
				>
					<div className="col-span-2 pb-5 md:col-span-1 flex flex-col">
						<BountyStatus bounty={bounty} />
					</div>
					<div className="col-span-2 md:col-span-1">
						<CopyBountyAddress bounty={bounty} />
					</div>
				</div>
				<LabelsList bounty={bounty} />
				{bounty?
					bounty.bountyTokenBalances.length != 0 ? (
						<>
							<div className="text-white flex font-bold gap-4 text-lg">
								{bounty?.status == 'CLOSED' ? 
									<>
										<span>Total Value Claimed</span>
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
										</svg>
									</> :
									<>
										<span>Current Total Value Locked</span>
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
										</svg>
									</>
								}
							</div>
							<TokenBalances
								tokenBalances={bounty?.bountyTokenBalances}
								tokenValues={tokenValues}
								singleCurrency={false}
							/>
						</>
					) : (
						<div className="pt-5 pb-5 font-semibold text-white">No deposits</div>
					) :
					<>
						<TokenBalances />
					</>
				}
				<div className='text-white font-bold pt-2'>Deposits</div>
				<div className="flex gap-x-8 flex-wrap">
					{bounty ? bounty.deposits
						.filter((deposit) => {
							return deposit.refunded == false;
						})
						.sort((a, b) => {
							return (parseInt(a.receiveTime) + parseInt(a.expiration)) - (parseInt(b.receiveTime) + parseInt(b.expiration));
						})
						.map((deposit, index) => 	<MiniDepositCard key={index} deposit={deposit} showLink={false}/>
						):
						<>
							<MiniDepositCard deposit={false} showLink={false}/>
							<MiniDepositCard deposit={false} showLink={false}/>
							<MiniDepositCard deposit={false} showLink={false}/>
						</>
					}
				</div>
			</div>

			<div className="flex flex-col pt-5">
				<div className="flex flex-row justify-between">
					<div className="font-bold text-xl text-white">Description</div>
					<BountyLinks bounty={bounty} hideBountyLink={true}/>
				</div>
				{bounty?
					<div 
						className="github_markup text-white pt-2 w-full break-words"
						dangerouslySetInnerHTML={{ __html: bounty.bodyHTML }}
					></div>:
					<div className="pt-2 w-3/4">
						<Skeleton count={4}/>
					</div>}
			</div>
			<div className="flex flex-col pt-5">
				<div className="flex flex-row justify-between">
					{/* <BountyContributors bounty={bounty} /> */}
				</div>
			</div>
		</div>
	);
};

export default BountyCardDetails;
