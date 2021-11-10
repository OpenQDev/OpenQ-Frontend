// Third Party
import React, { useState } from 'react';
import Image from 'next/image';
// Custom
import BountyCardDetailsModal from './BountyCardDetailsModal';

const BountyCard = (props) => {
	const {
		issue,
		isClaimed,
		deposits,
		address,
	} = props;

	const { owner, repoName, title, avatarUrl, labels, createdAt, closed } = issue;

	const [showModal, setShowModal] = useState(false);

	return (
		<div>
			<div
				className={'flex flex-col p-6 font-mont rounded-xl shadow-sm bg-white cursor-pointer pr-10 pl-10'}
				onClick={() => setShowModal(true)}
			>
				<div className="flex flex-row justify-between">
					<div>
						<div className="flex flex-grow flex-row items-center space-x-2">
							<div>{isClaimed ? 'Claimed' : 'Unclaimed'}</div>
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
							<div className="font-mont text-2xl">
								{owner.toLowerCase()}/{repoName.toLowerCase()}
							</div>
						</div>
						<div className="font-bold text-xl pl-6">
							{title.toLowerCase()}
						</div>
						<div className="flex flex-row items-center space-x-4 pt-1">
							<div className="font-mont font-light pl-6 text-sm text-gray-500">
								{createdAt}
							</div>
						</div>
					</div>
					<div className="flex flex-col">
						<Image src={avatarUrl} alt="avatarUrl" width="51" height="51" />
					</div>
				</div>
				{labels ? (
					<div className="flex flex-row pt-3 pl-6 pr-3 justify-between">
						<div className="space-x-2">
							{labels.map((label, index) => {
								if (index < 2) {
									return (
										<button
											key={index}
											className="font-mont rounded-lg text-xs py-1 px-2 font-bold bg-purple-500 text-white"
										>
											{label.name}
										</button>
									);
								} else if (index == 2) {
									return (
										<button
											key={index}
											className="font-mont rounded-lg text-xs py-1 px-2 font-bold bg-purple-500 text-white"
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
				{deposits ? (<div>
					{
						deposits.map(deposit => {
							return (
								<div className="flex flex-row space-x-2" key={deposit.symbol}>
									<div className="">{deposit.balance}{' '}{deposit.symbol}</div>
								</div>
							);
						})
					}
				</div>
				) : null}
			</div>
			{showModal && <BountyCardDetailsModal
				issue={issue}
				isClaimed={isClaimed}
				deposits={deposits}
				address={address}
				modalVisibility={setShowModal} />}
		</div>
	);
};

export default BountyCard;
