// Third Party
import React, { useContext } from 'react';
import Link from 'next/link';
// Custom
import useGetTokenValues from '../../hooks/useGetTokenValues';
import StoreContext from '../../store/Store/StoreContext';
import TokenBalances from '../TokenBalances/TokenBalances';

const OrganizationCard = ({ organization }) => {
	// Context
	const [tokenValues] = useGetTokenValues(organization.fundedTokenBalances);
	const [appState] = useContext(StoreContext);

	// Methods

	// Render
	return (
		<>
			<Link href={`/organization/${organization.login}`}>
				<div
					className={
						'flex flex-col p-6 font-mont rounded-xl shadow-sm bg-white cursor-pointer pr-10 pl-10'
					}
				>
					<div>
						Name: {organization.name}
					</div>
					<div>
						Description: {organization.description}
					</div>
					<div>
						OpenBounties: {organization.bountiesCreated.map(bounty => bounty.status == 'OPEN').length}
					</div>
					<div>
						{tokenValues ? <TokenBalances tokenBalances={organization.fundedTokenBalances} tokenValues={tokenValues} /> : null}
					</div>
					<div>
						{tokenValues ? <div>Organization TVL: {appState.utils.formatter.format(tokenValues.total)}</div> : null}
					</div>
				</div>
			</Link>
		</>
	);
};

export default OrganizationCard;
