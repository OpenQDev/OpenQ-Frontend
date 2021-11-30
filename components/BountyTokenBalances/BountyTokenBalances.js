// Third Party
import React from 'react';
import Image from 'next/image';
const contractMap = require('../../constants/contract-map.json');

const BountyTokenBalances = (props) => {
	const { bounty, tokenValueMap, tokenVolumes } = props;

	return (
		<div className="flex flex-row space-x-2 pt-1">
			<div>
				{Object.keys(tokenValueMap.tokens).map((tokenAddress) => {
					let symbol = contractMap[tokenAddress]['symbol'];
					let usdValue = tokenValueMap.tokens[tokenAddress];
					let volume = tokenVolumes[tokenAddress];

					return (
						<div
							className="flex flex-row space-x-2"
							key={symbol}
						>
							<div className="text-lg">${usdValue}</div>{' '}
							<div className="text-lg">({volume})</div>{' '}
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
	);
};

export default BountyTokenBalances;