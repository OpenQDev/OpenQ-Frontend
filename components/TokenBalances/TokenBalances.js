// Third Party
import React, { useContext } from 'react';
import Image from 'next/image';
import StoreContext from '../../store/Store/StoreContext';
const ethers = require('ethers');
import Skeleton from 'react-loading-skeleton';

const TokenBalances = ({ tokenBalances, tokenValues, header, singleCurrency }) => {
	const [appState] = useContext(StoreContext);
	const tokenBalancesArr = Array.isArray(tokenBalances) ? tokenBalances : [tokenBalances];
	const { tokenMetadata } = appState;

	return (
		<div className="flex flex-col">
			<div className="font-semibold text-white">{header}</div>
			<div className="font-bold text-xl text-white">
				{tokenBalances?.length > 1
					? tokenValues
						? `${appState.utils.formatter.format(tokenValues.total)}`
						: <Skeleton width={'6rem'} height={'20px'}/> : null}
			</div>
			<div className="flex flex-row space-x-2 pt-1">
				<div>
					{tokenValues && tokenBalances
						? tokenBalancesArr.map((tokenBalance) => {
							const tokenAddress = ethers.utils.getAddress(
								tokenBalance.tokenAddress
							);
							const tokenValueAddress = tokenMetadata[tokenAddress].address;

							const { volume } = tokenBalance;
							let symbol = tokenMetadata[tokenAddress].symbol;

							let bigNumberVolume = ethers.BigNumber.from(volume.toString());
							let decimals = parseInt(tokenMetadata[tokenAddress].decimals);

							let formattedVolume = ethers.utils.formatUnits(bigNumberVolume, decimals);

							let totalValue;
							if (!singleCurrency) {
								totalValue = tokenValues.tokens[tokenValueAddress.toLowerCase()];
							} else {
								totalValue = formattedVolume * tokenValues.tokenPrices[tokenValueAddress.toLowerCase()];
							}

							let usdValue = appState.utils.formatter.format(
								totalValue
							);

							return (
								<div
									className="flex flex-row flex-wrap gap-2 text-white"
									key={symbol}
								>
									<div className="pt-1">
										<Image
											src={tokenMetadata[tokenAddress].logoURI}
											alt="n/a"
											width="16"
											height="16"
										/>
									</div>
									<div className="text-lg text-white">{usdValue}</div>{' '}
									<div className="text-lg text-white">
										{formattedVolume}{'\xa0'}
										{symbol.toUpperCase()}
									</div>

								</div>
							);
						})
						: 
						<div className="flex flex-row space-x-2 pt-1">
							<div className="flex flex-row flex-wrap gap-2 text-white">
								<div className="pt-1">
									<Skeleton height={'12px'} width={'16px'} />
								</div>
								<div className="text-lg text-white">
									<Skeleton width={'8rem'}/>
								</div>{' '}
								<div className="text-lg text-white">
									<Skeleton width={'10rem'} />
								</div>
							</div>
						</div>
					}
				</div>
			</div>
		</div>
	);
};

export default TokenBalances;
