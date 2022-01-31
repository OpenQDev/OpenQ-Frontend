// Third Party
import React from 'react';
import TokenBalances from '../TokenBalances/TokenBalances';

// Custom
import BountyCardHeader from './BountyCardHeader';
import BountyLinks from './BountyLinks';
import BountyStatus from './BountyStatus';
import CopyBountyAddress from './CopyBountyAddress';
import LabelsList from './LabelsList';

const BountyCardDetails = ({ bounty, tokenValues }) => {
	console.log(bounty);
	return (
		<div className="flex flex-col font-mont pl-16 pr-16 pt-10 pb-10">
			<div className="flex flex-col border-b border-solid rounded-t">
				<BountyCardHeader bounty={bounty} />
				<div className="flex flex-row pt-5 space-x-10 justify-between">
					<div className="flex flex-col">
						<BountyStatus bounty={bounty} />
					</div>

					<CopyBountyAddress bounty={bounty} />
				</div>
				<LabelsList bounty={bounty} />
				{bounty.bountyTokenBalances.length != 0 ? (
					<TokenBalances
						tokenBalances={bounty.bountyTokenBalances}
						tokenValues={tokenValues}
					/>
				) : (
					<div className="pt-5 pb-5 font-semibold text-white">No deposits</div>
				)}
			</div>
			<div className="flex flex-col pt-5">
				<div className="flex flex-row justify-between">
					<div className="font-bold text-xl text-white">Description</div>
					<BountyLinks bounty={bounty} />
				</div>
				<div
					className="text-white pt-2"
					dangerouslySetInnerHTML={{ __html: bounty.bodyHTML }}
				></div>
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
