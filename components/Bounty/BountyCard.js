// Third Party
import React, { useContext, forwardRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import useGetTokenValues from '../../hooks/useGetTokenValues';

// Custom
import StoreContext from '../../store/Store/StoreContext';

const BountyCard = ({ bounty, loading, ref }) => {
	// State
	const bountyName = bounty?.title.toLowerCase()||'';
	const [appState] = useContext(StoreContext);

	// Hooks
	const [tokenValues] = useGetTokenValues(bounty?.bountyTokenBalances||[]);

	// Render
	return (
		<div ref={ref} className={loading&&'pointer-events-none cursor-normal'}>
			<Link
				href={`/bounty/${bounty?.bountyAddress}`}
			>
				<div
					className={
						'flex flex-col md:p-6 font-mont shadow-sm border-b border-web-gray cursor-pointer md:pr-10 md:pl-10 md:border md:rounded-xl'
					}
				>
					<div className="flex flex-row justify-between pt-5 sm:pt-0">
						
						<div className="w-3/4">
							<div className="flex flex-grow flex-row items-center space-x-2 pb-2 sm:pb-0 w-full">
								<div className="invisible md:visible">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill={loading? '#333' : bounty?.closed ? '#F0431D' : '#15FB31'}
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
								{loading?<Skeleton width={'100px'}/>:<div className="font-mont text-2xl text-white">
									{bounty?.owner.toLowerCase()}/{bounty?.repoName.toLowerCase()}
								</div>}
							</div>
							<div className="font-bold text-xl text-white pl-6">
								{loading?
									<Skeleton width={'100px'}/>:
									bounty?.title.length < 50
										? bounty?.title.toLowerCase()
										: bountyName.slice(0, 50) + '...'}
							</div>
							<div className="flex flex-row items-center space-x-4 pt-1 w-full">
								<div className="font-mont font-light pl-6 text-sm text-white w-full">
									{loading?
										<Skeleton width={'100%'}/>:
									
										`Issue Opened: ${appState.utils.formatDate(bounty?.createdAt)}`}
								</div>
							</div>
							<div className="flex flex-row items-center space-x-4 pt-1 w-full">
								<div className="font-mont font-light pl-6 text-sm text-white w-full">
									
									{loading?
										<Skeleton width={'100%'}/>:
										`Bounty Minted: ${appState.utils.formatUnixDate(parseInt(bounty?.bountyMintTime))}`
									}
								</div>
							</div>
							<div className="flex flex-row items-center space-x-4 pt-1">
								<div className="font-mont font-light pl-6 text-sm text-white">
									{loading?
										<Skeleton width={'60px'}/>:
										bounty?.status == 'OPEN' ? 'Unclaimed' : 'Claimed'
									}
								</div>
							</div>
						</div>
						{bounty?.avatarUrl?
							<div className="flex flex-col">
								<Image
									src={bounty?.avatarUrl}
									alt="avatarUrl"
									width="51"
									height="51"
								/>
							</div>:
							<Skeleton width={51} height={51}/>
						}
					</div>
					<div className="flex flex-row pt-3 pl-6 pr-3  items-center justify-between xs:pb-5 pb-5 md:pb-0 w-full">
						<div className="w-full">
							{bounty?.labels ? (
								<div className="flex flex-row gap-2 flex-wrap">
									{bounty?.labels.map((label, index) => {
										if (index < 2) {
											return (
												<div
													key={index}
													style={{
														borderColor: label.color,
														opacity: .9,
														color: label.color,
													}}
													className="font-mont rounded-lg text-xs py-1 px-2 font-bold border text-white"
												>
													{label.name}
												</div>
											);
										} else if (index == 2) {
											return (
												<div
													key={index}
													className="font-mont rounded-lg text-xs py-1 px-2 font-bold border border-green-300 text-white"
												>
														more..
												</div>
											);
										} else {
											null;
										}
									})}
								</div>
							) : null}
						</div>
							
						{loading?
							<Skeleton width={60}/>:
							<div className="flex flex-row space-x-1 items-center">
								<div className="pr-2 pt-1">
									<Image
										src="/BountyMaterial/eth.png"
										alt="avatarUrl"
										width="12"
										height="20"
									/>
								</div>
									
								<div className="font-semibold text-white">TVL</div>
								<div className="text-white">
									{tokenValues != null && tokenValues != {}
										? appState.utils.formatter.format(tokenValues.total)
										: appState.utils.formatter.format(0)}
								</div>
									
							</div>}
					</div>
				</div>
			</Link>
		</div>
	);
};

export default forwardRef(BountyCard);
