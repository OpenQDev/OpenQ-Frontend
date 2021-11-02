import Image from 'next/image';
import React, { useState } from 'react';
import DisplayPrice from './BountyCardComps/DisplayPrice';
import BountyCardDetailsModal from './BountyCardDetailsModal';

const BountyCard = (props) => {
	const {
		issueColor,
		orgName,
		issue,
		repoName,
		issueName,
		avatarUrl,
		labels,
		deposits,
		address,
	} = props;

	console.log(props);

	const [showModal, setShowModal] = useState(false);

	const getColor = () => {
		const colors = [
			"border-green-300",
			"border-blue-500",
			"border-yellow-100",
			"border-purple-600",
			"border-pink-200",
			"border-indigo-600",
		];
		return colors[issueColor];
	};

	return (
		<div>
			<div
				className={'flex flex-col p-6 font-mont rounded-xl shadow-sm bg-white cursor-pointer pr-10 pl-10'}
				onClick={() => setShowModal(true)}
			>
				<div className="flex flex-row justify-between">
					<div>
						<div className="flex flex-grow flex-row items-center space-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="#15FB31"
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
								{orgName.toLowerCase()}/{repoName.toLowerCase()}
							</div>
						</div>
						<div className="font-bold text-xl pl-6">
							{issueName.toLowerCase()}
						</div>
						<div className="flex flex-row items-center space-x-4 pt-1">
							<div className="font-mont font-light pl-6 text-sm text-gray-500">
								created 3 hours ago
							</div>
							<div className="flex flex-row items-center space-x-1">
								<div className="">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="gray"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
										/>
									</svg>
								</div>
								<div className="font-mont font-light text-xs text-gray-500">
									5
								</div>
							</div>
							<div className="flex flex-row items-center space-x-1">
								<div>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="gray"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
										/>
									</svg>
								</div>
								<div className="font-mont font-light text-xs text-gray-500">
									0
								</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col">
						<Image src={avatarUrl} alt="avatarUrl" width="51" height="51" />
					</div>
				</div>
				{/* <div className="justify-left pl-5 pt-1">
          <CopyAddressToClipboard data={address} />
        </div>{" "} */}
				{/*  Please make this better */}
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
						<div className="flex flex-row space-x-2">
							<DisplayPrice />
							<div className="">20 DAI</div>
						</div>
					</div>
				) : (
					<div className="flex flex-row space-x-2 justify-end">
						<DisplayPrice />
						<div className="">10 DAI</div>
					</div>
				)}
			</div>
			{showModal && <BountyCardDetailsModal
				issueColor={issueColor}
				orgName={orgName}
				issue={issue}
				repoName={repoName}
				issueName={issueName}
				avatarUrl={avatarUrl}
				labels={labels}
				deposits={deposits}
				address={address}
				modalVisibility={setShowModal} />}
		</div>
	);
};

export default BountyCard;
