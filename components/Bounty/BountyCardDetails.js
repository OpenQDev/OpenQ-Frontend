// Third Party
import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import TokenBalances from '../TokenBalances/TokenBalances';

// Custom
import BountyCardHeader from './BountyCardHeader';
import BountyLinks from './BountyLinks';
import BountyStatus from './BountyStatus';
import CopyBountyAddress from './CopyBountyAddress';
import LabelsList from './LabelsList';


const BountyCardDetails = ({ bounty, tokenValues }) => {
	const [appState] = useContext(StoreContext);

	return (
		<div className="flex flex-col font-mont pl-5 pr-5 md:pl-16 md:pr-16 pt-10 pb-10 my-16 border-web-gray border rounded-lg w-5/6">
			<div className="flex flex-col border-b border-solid rounded-t ">
				<BountyCardHeader bounty={bounty} />
				<div
					className="grid grid-cols-2 pt-5 justify-center 
				md:justify-between"
				>
					<div className="col-span-2 pb-5 md:pb-0 md:col-span-1 flex flex-col">
						<BountyStatus bounty={bounty} />
					</div>
					<div className="col-span-2 md:col-span-1">
						<CopyBountyAddress bounty={bounty} />
					</div>
				</div>
				<LabelsList bounty={bounty} />
				{bounty.bountyTokenBalances.length != 0 ? (
					<TokenBalances
						header={bounty.status == 'CLOSED' ? 'Total Value Claimed' : 'Current Total Value Locked'}
						tokenBalances={bounty.bountyTokenBalances}
						tokenValues={tokenValues}
					/>
				) : (
					<div className="pt-5 pb-5 font-semibold text-white">No deposits</div>
				)}
				<div className='text-white font-bold'>Deposits</div>
				<div className="flex gap-x-8 flex-wrap">
					{bounty.deposits
						.filter((deposit) => {
							return deposit.refunded == false;
						})
						.sort((a, b) => {
							return (parseInt(a.receiveTime) + parseInt(a.expiration)) - (parseInt(b.receiveTime) + parseInt(b.expiration));
						})
						.map((deposit) => {
							const open=(bounty.status==='OPEN');
							const timeToExpiry = parseInt(deposit.receiveTime)+parseInt(deposit.expiration)-Date.now()*0.001;		
							return (
								<div key={deposit.id} className={`bg-web-gray/20 ${(open) ? timeToExpiry<604800?'border-red-500': timeToExpiry <1209600 ? 'border-yellow-500' :'border-green-500' : 'border-web-gray'} border px-8 my-4 pb-4 rounded-md max-w-sm`}>
									<TokenBalances 
										tokenBalances={[deposit]}
										tokenValues={tokenValues} />
									{(open) && <div key={deposit.id} className='text-white'>Locked until: {appState.utils.formatUnixDate(parseInt(deposit.receiveTime) + parseInt(deposit.expiration))}</div>
									}		</div>
							);
						})
					}
				</div>
			</div>

			<div className="flex flex-col pt-5">
				<div className="flex flex-row justify-between">
					<div className="font-bold text-xl text-white">Description</div>
					<BountyLinks bounty={bounty} />
				</div>
				<div
					className="text-white pt-2 w-full break-words"
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
