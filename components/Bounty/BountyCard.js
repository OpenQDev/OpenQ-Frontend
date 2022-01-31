// Third Party
import React, { useContext, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useGetTokenValues from '../../hooks/useGetTokenValues';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCardDetailsModal from './BountyCardDetailsModal';

const BountyCard = (props) => {
	const { bounty } = props;

	// State
	const bountyName = bounty.title.toLowerCase();
	const [appState] = useContext(StoreContext);
	const [showModal, setShowModal] = useState(false);

	// Hooks
	const [tokenValues] = useGetTokenValues(bounty.bountyTokenBalances);

	// Render
	return (
		<div>
			<Link
				href={`/?address=${bounty.bountyAddress}`}
				as={`/bounty/${bounty.bountyAddress}`}
			>
				<div
					className={
						'flex flex-col p-6 font-mont rounded-xl shadow-sm border border-web-gray cursor-pointer pr-10 pl-10'
					}
					onClick={() => setShowModal(true)}
				>
					<div className="flex flex-row justify-between">
						<div>
							<div className="flex flex-grow flex-row items-center space-x-2">
								{/*  <div>{isClaimed ? "Claimed" : "Unclaimed"}</div> */}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill={closed ? '#F0431D' : '#15FB31'}
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
								<div className="font-mont text-2xl text-white">
									{bounty.owner.toLowerCase()}/{bounty.repoName.toLowerCase()}
								</div>
							</div>
							<div className="font-bold text-xl text-white pl-6">
								{bounty.title.length < 50
									? bounty.title.toLowerCase()
									: bountyName.slice(0, 50) + '...'}
							</div>
							<div className="flex flex-row items-center space-x-4 pt-1">
								<div className="font-mont font-light pl-6 text-sm text-white">
									Opened {appState.utils.formatDate(bounty.createdAt)}
								</div>
							</div>
						</div>
						<div className="flex flex-col">
							<Image
								src={bounty.avatarUrl}
								alt="avatarUrl"
								width="51"
								height="51"
							/>
						</div>
					</div>
					<div className="flex flex-row pt-3 pl-6 pr-3  items-center justify-between">
						<div>
							{bounty.labels ? (
								<div className="flex flex-row justify-between">
									<div className="space-x-2">
										{bounty.labels.map((label, index) => {
											if (index < 2) {
												return (
													<button
														key={index}
														className="font-mont rounded-lg text-xs py-1 px-2 font-bold border border-purple-500 text-white"
													>
														{label.name}
													</button>
												);
											} else if (index == 2) {
												return (
													<button
														key={index}
														className="font-mont rounded-lg text-xs py-1 px-2 font-bold border border-green-300 text-white"
													>
														more..
													</button>
												);
											} else {
												null;
											}
										})}
									</div>
								</div>
							) : null}
						</div>
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
						</div>
					</div>
				</div>
			</Link>
			{showModal && (
				<BountyCardDetailsModal
					bounty={bounty}
					modalVisibility={setShowModal}
					tokenValues={tokenValues}
				/>
			)}
		</div>
	);
};

export default BountyCard;
