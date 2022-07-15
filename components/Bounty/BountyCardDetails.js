// Third party
import React, { useEffect } from 'react';
import Link from 'next/link';

// Custom
import BountyCardHeader from './BountyCardHeader';
import TokenBalances from '../TokenBalances/TokenBalances';
import BountyLinks from './BountyLinks';
import BountyStatus from './BountyStatus';
import CopyBountyAddress from './CopyBountyAddress';
import CopyBountyAssigneeLink from './CopyBountyAssigneeLink';
import LabelsList from './LabelsList';
import MiniDepositCard from './MiniDepositCard';
import ToolTip from '../Utils/ToolTip';


const BountyCardDetails = ({ bounty, address, tokenValues, internalMenu }) => {
	useEffect(()=>{
		console.log(bounty);});
	return (		
		<div className={`flex flex-col w-full font-mont sm:pl-5 sm:pr-5 md:px-10 pt-10 pb-10 my-16 w-5/6 max-w-6xl ${internalMenu !== 'View' ? 'hidden' : null}`}>
			<div className="flex w-full flex-col border-b pb-6 border-solid justify-items-center items-center content-between rounded-t">
				<	div className='self-start w-full'>
					<BountyCardHeader bounty={bounty} />
				</div>
				<div className="grid w-full lg:grid-cols-[repeat(auto-fill,_minmax(max(102px,_100%/4-16px),_1fr))] xl:grid-cols-[repeat(auto-fill,_minmax(max(102px,_100%/6-32px),_1fr))] justify-center lg:justify-items-start pt-5 mx-auto md:mx-2 gap-4">
					<div className="xl:col-span-3 lg:col-span-2">
						<BountyStatus bounty={bounty} />
					</div>
					<div className="lg:col-span-2  xl:col-span-3">
						<CopyBountyAddress address={address} />
					</div>

					<div className='lg:col-span-2 xl:col-span-3 pt-2'>
						<h3 className='font-bold'>Linked Pull Requests</h3>
						{bounty?.prs?.some(pr => pr.source['__typename'] === 'PullRequest' && pr.source.url) > 0 ? <ul>
							{bounty.prs.filter((pr) => {
								return pr.source['__typename'] === 'PullRequest' && pr.source.url;
							}).map((pr, index) => {
								if (pr.source['__typename'] === 'PullRequest' && pr.source.url) return <li className={`${pr.source.merged ? 'text-claimed-bounty' : null}`} key={index}>
									<Link href={pr.source.url}><a target="_blank" className={'underline'}>{pr.source.title}</a></Link><span> {pr.source.merged ? '(merged)' : '(not merged)'}</span>
								</li>;
							})}
						</ul> : <span>No linked pull requests</span>}
					</div>

					<div className="lg:col-span-2  xl:col-span-3">
						{bounty && bounty?.assignees && (
							<div className="mt-2">
								<CopyBountyAssigneeLink bounty={bounty} />
							</div>
						)}
					</div>
					<div className='lg:col-span-2 xl:col-span-3 pt-2'>
						{bounty.bountyTokenBalances &&
							bounty.bountyTokenBalances.length != 0 ? (
								<>
									<div className="flex font-bold gap-2">
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
									{bounty.bountyTokenBalances && <TokenBalances
										tokenBalances={bounty.bountyTokenBalances}
										tokenValues={tokenValues}
										singleCurrency={false}
									/>}
								</>
							) : (
								<div className='py-2'>
									<h3 className="font-semibold ">No deposits</h3>
									<p >It may take up to one minute for new deposits to show up here.</p>
								</div>
							)
						}


					</div>
					
					<div className="lg:col-span-2  xl:col-span-3 font-semibold underline flex gap-2">
						<ToolTip styles={'font-normal w-60'} toolTipText={'Invoice generation is not guaranteed to be correct by default. We try to create a draft that is as close as possible to what is actually required. Please give us feedback if you miss a feature and create an issue:'} link={'https://github.com/OpenQDev/OpenQ-Frontend/issues/new/choose'} customOffsets={[0, 22]} >
							{bounty && <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/invoice/${bounty.id}/${bounty.bountyAddress}`}>
								<a className='flex gap-2'>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
										<path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
						Generate Invoice
								</a>
							</Link>
							}</ToolTip>
					</div>
					{bounty.bountyTokenBalances?.length != 0 && <div className='col-start-1 md:col-end-3 lg:col-end-[-1] w-full pt-4'>
						<h3 className='text-center font-bold text-xl'>Deposits</h3>
						<p className='text-tinted col-start-1 md:col-end-3 lg:col-end-[-1] w-full'>It may take up to one minute for new deposits to show up here.</p>
					</div>}


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
				</div>
			</div>

			<div className="flex flex-col pt-4">
				<div className="flex flex-row justify-between">
					<div className="font-bold text-xl ">Description</div>
					<BountyLinks bountyAddress={address} bounty={bounty} address={address} hideBountyLink={true} />
				</div>
				<div>
					<LabelsList bounty={bounty} />
				</div>
			</div>
			<div className="flex flex-col pt-5">
				<div className="flex flex-row justify-between">
					<div
						className="markdown-body pt-2 w-full break-words"
						dangerouslySetInnerHTML={{ __html: bounty.bodyHTML }}
					></div>
				</div>
			</div>
		</div>
	);
};

export default BountyCardDetails;
