// Third Party
import Image from 'next/image';
import React from 'react';
import BountyTokenBalances from '../BountyTokenBalances/BountyTokenBalances';

// Custom
import CopyAddressToClipboard from '../tools/CopyAddressToClipboard';
import BountyLinks from './BountyLinks';
import LabelsList from './LabelsList';

const BountyCardDetails = (props) => {
	const { bounty, tokenValueMap, tokenVolumes } = props;

	const getDate = () => {
		const rawDate = bounty.createdAt;
		const date = new Date(rawDate);
		return date.toDateString().split(' ').slice(1).join(' ');
	};

	return (
		<div className="flex flex-col font-mont pl-16 pr-16 pt-10 pb-10">
			<div className="flex flex-col border-b border-solid rounded-t">
				<div className="flex flex-row space-x-20 justify-between">
					<div className="flex flex-col">
						<div className="text-xl">
							{bounty.owner}/{bounty.repoName}
						</div>
						<div className="text-xl font-bold">{bounty.title}</div>
					</div>
					<div>
						<Image src={bounty.avatarUrl} alt="avatarUrl" width="51" height="51" />
					</div>
				</div>
				<div className="flex flex-row pt-5 space-x-10 justify-between">
					<div className="flex flex-col">
						<div className="font-bold">Status</div>
						<div className="flex flex-row space-x-2 pt-2">
							<div className="pt-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill={bounty.closed ? '#F0431D' : '#15FB31'}
									viewBox="0 0 16 16"
									width="15"
									height="15"
								>
									<path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
									<path
										fillRule="evenodd"
										d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
									></path>
								</svg>
							</div>
							<div className="flex space-x-1">
								<div>{bounty.status == 'OPEN' ? 'Unclaimed' : 'Claimed'}</div>
								<div>{getDate()}</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col">
						<div className="font-bold">Smart Contract</div>
						<div className="flex flex-row items-center space-x-2 cursor-pointer">
							<CopyAddressToClipboard data={bounty.bountyAddress} />
						</div>
					</div>
				</div>
				<LabelsList bounty={bounty} />
				{bounty.deposits.length != 0 ? <BountyTokenBalances bounty={bounty} tokenValueMap={tokenValueMap} tokenVolumes={tokenVolumes} /> : 'No deposits.'}
			</div>
			<div className="flex flex-col pt-5">
				<div className="flex flex-row justify-between">
					<div className="font-bold text-xl">Description</div>
					<BountyLinks bounty={bounty} />
				</div>
				<div className="pt-2">{bounty.body}</div>
			</div>
		</div>
	);
};

export default BountyCardDetails;
