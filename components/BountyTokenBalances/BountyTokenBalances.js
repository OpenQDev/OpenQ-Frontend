// Third Party
import React, { useContext } from 'react';
import Image from 'next/image';
import StoreContext from '../../store/Store/StoreContext';
const ethers = require('ethers');

const BountyTokenBalances = ({ bounty, tokenValues }) => {
	const [appState,] = useContext(StoreContext);

	const { tokenMetadata } = appState;

	return (
		<div className="flex flex-col pt-4 pb-6">
			<div className="font-semibold text-gray-700">
				Total Value Locked (TVL)
			</div>
			<div className="font-bold text-xl">
				{tokenValues ? `${appState.utils.formatter.format(tokenValues.total)}` : `${appState.utils.formatter.format(0)}`}
			</div>
			<div className="flex flex-row space-x-2 pt-1">
				<div>
					{tokenValues ? bounty.bountyTokenBalances.map((tokenBalance) => {
						const tokenAddress = ethers.utils.getAddress(tokenBalance.tokenAddress);
						const tokenValueAddress = tokenMetadata[tokenAddress].address;

						const { volume } = tokenBalance;
						let symbol = tokenMetadata[tokenAddress].symbol;
						let usdValue = appState.utils.formatter.format(tokenValues.tokens[tokenValueAddress]);

						return (
							<div
								className="flex flex-row space-x-2"
								key={symbol}
							>
								<div className="text-lg">{usdValue}</div>{' '}
								<div className="text-lg">({ethers.utils.formatEther(volume)} {symbol.toUpperCase()})</div>{' '}
								<div className="pt-1">
									<Image
										src={tokenMetadata[tokenAddress].logoURI}
										alt="n/a"
										width="16"
										height="16"
									/>
								</div>
							</div>
						);
					}) : null}
				</div>
			</div>
		</div>
	);
};

export default BountyTokenBalances;