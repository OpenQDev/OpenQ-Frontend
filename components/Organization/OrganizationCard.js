// Third Party
import React, { useContext, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
					<Image src={organization.avatarUrl} alt="n/a" width="25px" height="25px" />
					<div className='text-center'>
						{organization.name}
					</div>
					<div className='bg-pink dark:text-white rounded shadow-md font-semibold font-sans relative'>
						{organization.bountiesCreated.map(bounty => bounty.status == 'OPEN').length}
					</div>
					<div>
						{tokenValues ? <TokenBalances tokenBalances={organization.fundedTokenBalances} tokenValues={tokenValues} /> : null}
					</div>
					<div>
						{tokenValues ? <div>{appState.utils.formatter.format(tokenValues.total)}</div> : null}
					</div>
				</div>
			</Link>
		</>
	);
};

export default OrganizationCard;
