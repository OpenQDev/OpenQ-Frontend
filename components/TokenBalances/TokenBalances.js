// Third party
import React, { useState, useContext, useEffect } from 'react';
import Image from 'next/image';
import StoreContext from '../../store/Store/StoreContext';
const ethers = require('ethers');
import Skeleton from 'react-loading-skeleton';
 
const TokenBalances = ({ tokenBalances, tokenValues, header, singleCurrency, showOne }) => {
	const [appState] = useContext(StoreContext);
	const tokenBalancesArr = Array.isArray(tokenBalances) ? tokenBalances : [tokenBalances];

	const [displayedBalances, updateDisplayedBalances] = useState();
	useEffect(() => {
		let didCancel;
		if (tokenBalancesArr[0] && tokenValues) {
			let highest = 0;
			const totalValueBalances = tokenBalancesArr.map((tokenBalance) => {
				const tokenAddress = ethers.utils.getAddress(
					tokenBalance.tokenAddress
				);
				const tokenMetadata = appState.tokenClient.getToken(tokenAddress);
				const tokenValueAddress = tokenMetadata.address.toLowerCase();
				const symbol =  tokenMetadata.symbol ||`${tokenAddress.slice(0, 4)}...${tokenAddress.slice(36)}`;
				const { volume } = tokenBalance;

				let bigNumberVolume = ethers.BigNumber.from(volume.toString());
				let decimals = parseInt(tokenMetadata.decimals)||18;
				let formattedVolume = ethers.utils.formatUnits(bigNumberVolume, decimals);
				let totalValue;
				if (!singleCurrency) {
					totalValue = tokenValues?.tokens[tokenValueAddress];
				} else {
					totalValue = formattedVolume * tokenValues?.tokenPrices[tokenValueAddress];
				}

				let usdValue = appState.utils.formatter.format(
					totalValue
				);
				if (totalValue > highest) highest = totalValue;
				const path = tokenMetadata.path||tokenMetadata.logoURI;
				if(tokenValues){
					return { ...tokenBalance, tokenAddress, totalValue, usdValue, symbol, path, formattedVolume };
				}
			});
			const filteredTokenBalances = totalValueBalances.filter((balance) => {
				if (!showOne) { return true; }
				// So we don't end up with a tie.
				if (balance?.totalValue >= highest) {
					highest >= 0.01;
					return true;
				}
			});
			if(filteredTokenBalances[0] && !didCancel){
				updateDisplayedBalances(filteredTokenBalances);}
		}
		return ()=>{didCancel = true;};
	}, [tokenBalances, tokenValues]);
	/*console.log(displayedBalances?.[0]?.usdValue);
	console.log(tokenBalances);
	console.log(tokenValues);*/
	return (
		<div className="flex flex-col">{displayedBalances?.[0]?.usdValue}
			<div className="font-semibold">{header}</div>
			<div className="font-bold text-xl ">
				{tokenBalances && !showOne ? tokenValues	?
					`${appState.utils.formatter.format(tokenValues.total)}` :
					tokenBalances.length === 0  
						? `${appState.utils.formatter.format(0)}`:
						<Skeleton/>
					:null}
			</div>
			<div className="flex flex-row space-x-2 pt-1">
				<div>
					{tokenBalances && displayedBalances && (( displayedBalances.length > 0) || tokenBalances.length === 0)
						? displayedBalances.map((tokenBalance) => {
							const { symbol, usdValue, formattedVolume, path } = tokenBalance;

							return (
								<div
									className="flex flex-row flex-wrap gap-2  content-center items-center"
									key={symbol}
								>
									<div className="pt-1">
										<Image
											src={path ||'/crypto-logos/ERC20.svg' }
											className="rounded-full"
											alt="n/a"
											width="16"
											height="16"
										/>
									</div>
									<div className="text-lg ">{usdValue}</div>{' '}
									<div className="text-lg ">
										{formattedVolume}{'\xa0'}
										{symbol.toUpperCase()}
									</div>

								</div>
							);
						})
						:
						<div className="flex flex-row space-x-2">
							<div className="flex flex-row flex-wrap gap-2 ">
								<div className="pt-1">
									<Skeleton height={'12px'} width={'16px'} />
								</div>
								<div className="text-lg ">
									<Skeleton width={'8rem'} height={'12px'} />
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
