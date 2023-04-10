// Third party
import React, { useContext } from 'react';
import Image from 'next/image';
import StoreContext from '../../../store/Store/StoreContext';
import { ethers } from 'ethers';
import useGetTokenValues from '../../../hooks/useGetTokenValues';

const TokenBalances = ({ tokenBalances }) => {
  const [appState] = useContext(StoreContext);
  const [tokenValues] = useGetTokenValues(tokenBalances);

  const getFilteredTokenBalances = (tokenValues) => {
    if (!tokenBalances[0] || !tokenValues) return null;
    const totalValueBalances = tokenBalances.map((tokenBalance) => {
      const tokenAddress = ethers.utils.getAddress(tokenBalance.tokenAddress);
      const tokenMetadata = appState.tokenClient.getToken(tokenAddress);
      const tokenValueAddress = tokenMetadata.valueAddress.toLowerCase();
      const symbol = tokenMetadata.symbol;
      const { volume } = tokenBalance;

      let bigNumberVolume = ethers.BigNumber.from(volume.toString());
      let decimals = parseInt(tokenMetadata.decimals);
      let formattedVolume = ethers.utils.formatUnits(bigNumberVolume, decimals);
      const totalValue = (formattedVolume * tokenValues?.tokenPrices[tokenValueAddress]).toFixed(2);

      const fixedVolume = Number.isInteger(Number(formattedVolume * 10))
        ? Number(formattedVolume).toFixed(2)
        : parseFloat(Number(formattedVolume).toFixed(10));

      let usdValue = appState.utils.formatter.format(totalValue);
      const path = tokenMetadata.path || tokenMetadata.logoURI;
      if (tokenValues) {
        return {
          symbol,
          usdValue,
          fixedVolume,
          path,
        };
      }
    });

    return totalValueBalances[0] && totalValueBalances;
  };
  const displayedBalances = getFilteredTokenBalances(tokenValues);
  return (
    <div className='flex flex-col'>
      <div className='flex flex-row space-x-2 pt-1'>
        <div>
          {displayedBalances?.length > 0
            ? displayedBalances.map((tokenBalance) => {
                const { symbol, usdValue, fixedVolume, path } = tokenBalance;

                return (
                  <div className='flex flex-row flex-wrap gap-2  content-center items-center' key={symbol}>
                    <div className='pt-1'>
                      <Image
                        src={path || '/crypto-logos/ERC20.svg'}
                        className='rounded-full'
                        alt='n/a'
                        width='16'
                        height='16'
                      />
                    </div>
                    <div className={`text-base text-primary`}>{usdValue}</div>{' '}
                    <div className={`text-base text-primary`}>
                      {fixedVolume}
                      {'\xa0'}
                      {symbol.toUpperCase()}
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default TokenBalances;
