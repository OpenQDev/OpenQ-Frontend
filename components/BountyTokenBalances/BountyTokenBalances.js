// Third Party
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import StoreContext from '../../store/Store/StoreContext';
const contractMap = require('../../constants/contract-map.json');
const ethers = require('ethers');

const BountyTokenBalances = (props) => {
	const { bounty, tokenValueMap, tokenVolumes } = props;
	const [appState,] = useContext(StoreContext);

	return (
		<div className="flex flex-col pt-4 pb-6">
			<div className="font-semibold text-gray-700">
				Total Value Locked (TVL)
			</div>
			<div className="font-bold text-xl">
				{bounty.deposits.length == 0 ? '0.00' : `${appState.utils.formatter.format(tokenValueMap.total)}`}
			</div>
			<div className="flex flex-row space-x-2 pt-1">
				<div>
					{Object.keys(tokenValueMap.tokens).map((tokenAddress) => {
						let symbol = contractMap[tokenAddress]['symbol'];
						let usdValue = appState.utils.formatter.format(tokenValueMap.tokens[tokenAddress]);
						let volume = tokenVolumes[tokenAddress];

						return (
							<div
								className="flex flex-row space-x-2"
								key={symbol}
							>
								<div className="text-lg">{usdValue}</div>{' '}
								<div className="text-lg">({ethers.utils.formatEther(volume)} {symbol.toUpperCase()})</div>{' '}
								<div className="pt-1">
									<Image
										src={`/cryptocurrency-icons/32/color/${symbol.toLowerCase()}.png`}
										alt="n/a"
										width="16"
										height="16"
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default BountyTokenBalances;