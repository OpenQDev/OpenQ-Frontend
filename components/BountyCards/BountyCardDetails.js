// Third Party
import React from 'react';
import BountyTokenBalances from '../BountyTokenBalances/BountyTokenBalances';

// Custom
import BountyCardHeader from './BountyCardHeader';
import BountyLinks from './BountyLinks';
import BountyStatus from './BountyStatus';
import CopyBountyAddress from './CopyBountyAddress';
import LabelsList from './LabelsList';

const BountyCardDetails = (props) => {
	const { bounty, tokenValueMap, tokenVolumes } = props;

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
