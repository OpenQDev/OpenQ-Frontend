import React, { useContext, useMemo } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import Image from 'next/image';
import ToolTipNew from '../Utils/ToolTipNew';
import Link from 'next/link';
import { PersonAddIcon, PersonIcon, PeopleIcon } from '@primer/octicons-react';

const CarouselBounty = ({ bounty }) => {
	const [appState] = useContext(StoreContext);


	const createBudget = (bounty) => {
		return bounty.fundingGoalTokenAddress ? { tokenAddress: bounty.fundingGoalTokenAddress, volume: bounty.fundingGoalVolume } : null;
	};
	const budgetObj = useMemo(() => createBudget(bounty), [
		bounty
	]);
	const [budgetValue] = useGetTokenValues(budgetObj);
	const budget = budgetValue?.total;

	const [payoutValues] = useGetTokenValues(bounty.payouts);
	const [refundValues] = useGetTokenValues(bounty.refunds);
	const [tokenValues] = useGetTokenValues(bounty?.bountyTokenBalances);

	const tokenTotal = tokenValues?.total;
	const payoutTotal = payoutValues?.total;
	const refundTotal = refundValues?.total;
	const price = tokenTotal - payoutTotal - refundTotal;

	return (

		<>
			<Link target={'_blank'} rel="noopener noreferrer" href={`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${bounty.bountyId}/${bounty.bountyAddress}`}>
				<a className='border-web-gray bg-dark-mode p-4 pl-2 gap-2 border rounded-sm flex'>
					<div className="pt-1 pl-2"> 
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill={bounty?.STATUS === 'CLOSED' ? '#F0431D' : '#15FB31'}
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
					<div className=' w-48'>
						<div className="flex flex-row">
						<p className='text-normal truncate'>{bounty.owner.toLowerCase()}/{bounty.repoName.toLowerCase()}</p>
						</div>
						<h4 className='font-semibold truncate leading-tight mb-1'>{bounty.title.toLowerCase()}</h4>
						<div className="pt-2">
							{bounty.bountyType === '0' ?
										<span className='font-semibold flex flex-end items-center content-center gap-1 w-max'>
											<PersonIcon />
											<div className='whitespace-nowrap'>Single</div>
										</span> :
										bounty.bountyType === '1' ?

											<span className='font-semibold flex flex-end items-center content-center gap-1 w-max'>
												<PersonAddIcon />
												<div className='whitespace-nowrap'>Multi</div>
											</span> :

											(bounty.bountyType === '2' || bounty.bountyType === '3') &&
											<span className='font-semibold flex flex-end items-center content-center gap-1 w-max'>
												<PeopleIcon />
												<div className='whitespace-nowrap'>Weighted</div>
											</span>

									}
						</div>

						<p className='text-sm pt-20'>Deployed: {appState.utils.formatUnixDate(parseInt(bounty?.bountyMintTime), true)}</p>
						<div className="pt-2">
						{price > budget ? <div className="flex flex-row space-x-1 items-center">
									<div className="pr-2 pt-1">
										<Image
											src="/crypto-logos/ETH-COLORED.png"
											alt="avatarUrl"
											width="12"
											height="20"
										/>
									</div>

									<>
										<div className="font-semibold ">TVL</div>
										<div className="">
											{appState.utils.formatter.format(price)}
										</div>
									</>

								</div> :
									budget > 0 ?
										<>
											<div className="flex flex-row space-x-1 items-center">
												<div className="pr-2 pt-1">
													<Image
														src="/crypto-logos/ETH.svg"
														alt="avatarUrl"
														width="12"
														height="20"
													/>
												</div>

												<>
													<div className="font-semibold ">Budget</div>
													<div className="">
														{appState.utils.formatter.format(budget)}
													</div>
												</>
											</div>
										</>
										:
										<div className="flex gap-2">
											<div className="flex flex-row space-x-1 items-center">
												<div className="pr-2 pt-1">
													<Image
														src="/crypto-logos/ETH.svg"
														alt="avatarUrl"
														width="12"
														height="20"
													/>
												</div>

												<>
													<div className="font-semibold ">Budget</div>
												</>
											</div>
											<div className="flex flex-row space-x-1 items-center">
												<ToolTipNew
													innerStyles={'whitespace-normal w-60'}
													toolTipText={'No budget has been set for this contract'} >
													<div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>?</div>
												</ToolTipNew>
											</div>
										</ div>
								}
						</div>
					</div>
				</a></Link>
		</>
	);
};
export default CarouselBounty;