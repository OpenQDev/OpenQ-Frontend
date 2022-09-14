import React, { useContext, useMemo } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import { ethers } from 'ethers';

const ClaimPerToken = ({ bounty, tokenAddress, claimant, claimants, stillClaim }) => {
  const [appState] = useContext(StoreContext);

  const claimantVolume = () => {
    const tokenMetadata = appState.tokenClient.getToken(tokenAddress);
    const volume = bounty.payouts.filter(
      (payout) => payout.closer.id == claimant && payout.tokenAddress == tokenAddress
    )[0].volume;
    let bigNumberVolume = ethers.BigNumber.from(volume.toString());
    let decimals = parseInt(tokenMetadata.decimals) || 18;
    return ethers.utils.formatUnits(bigNumberVolume, decimals);
  };

  const claimantPercent = () => {
    return (claimantVolume(claimant, tokenAddress) / totalDepositVolume(tokenAddress)) * 100;
  };

  const claimantBalances = () => {
    const getBalances = () => {
      return claimant
        ? bounty.payouts.filter((payout) => payout.closer.id == claimant && payout.tokenAddress == tokenAddress)
        : null;
    };
    const balanceObj = useMemo(() => getBalances(), [claimant, tokenAddress]);
    const [balanceValues] = useGetTokenValues(balanceObj);
    return balanceValues?.total;
  };

  const claimedVolume = () => {
    const tokenMetadata = appState.tokenClient.getToken(tokenAddress);
    const volume = bounty.payouts
      ?.filter((payout) => payout.tokenAddress == tokenAddress)
      .map((payout) => payout.volume)
      .reduce((a, b) => parseInt(a) + parseInt(b));
    let bigNumberVolume = ethers.BigNumber.from(volume.toLocaleString('fullwide', { useGrouping: false }));
    let decimals = parseInt(tokenMetadata.decimals) || 18;
    return ethers.utils.formatUnits(bigNumberVolume, decimals);
  };

  const claimedBalances = () => {
    const payouts = claimants ? bounty.payouts.filter((payout) => payout.tokenAddress == tokenAddress) : null;
    const claims = [];
    let i;
    for (i = 0; i < payouts?.length; i++) {
      const balanceObj = useMemo(() => payouts[i], [bounty]);
      const [balanceValues] = useGetTokenValues(balanceObj);
      claims.push(balanceValues?.total);
    }
    return claims.reduce((a, b) => a + b);
  };

  const stillClaimable = () => {
    const getBalances = () => {
      return bounty.bountyTokenBalances
        ? bounty.bountyTokenBalances.filter((balances) => balances.tokenAddress == tokenAddress)
        : null;
    };
    const balanceObj = useMemo(() => getBalances(), [tokenAddress]);
    const [balanceValues] = useGetTokenValues(balanceObj);
    return balanceValues?.total;
  };

  const totalDepositVolume = () => {
    const tokenMetadata = appState.tokenClient.getToken(tokenAddress);
    const volume = bounty.deposits
      .filter((deposit) => deposit.tokenAddress == tokenAddress)
      .map((deposit) => deposit.volume)
      .reduce((a, b) => parseInt(a) + parseInt(b));
    let bigNumberVolume = ethers.BigNumber.from(volume.toLocaleString('fullwide', { useGrouping: false }));
    let decimals = parseInt(tokenMetadata.decimals) || 18;
    return ethers.utils.formatUnits(bigNumberVolume, decimals);
  };

  const totalDepositBalance = () => {
    const getBalances = () => {
      return bounty.payouts ? bounty.payouts.filter((payout) => payout.tokenAddress == tokenAddress) : null;
    };
    const balanceObj = useMemo(() => getBalances(tokenAddress), [tokenAddress]);
    const [balanceValues] = useGetTokenValues(balanceObj);
    return balanceValues?.total + stillClaimable(tokenAddress);
  };

  return (
    <div className='border flex justify-end'>
      <td className='px-2 pb-2 text-center'>
        <td className='px-2 pb-2 text-center'>
          {claimant ? (
            <>{claimantVolume()}</>
          ) : claimants ? (
            <>{claimedVolume()}</>
          ) : stillClaim ? (
            <>{parseFloat(totalDepositVolume() - claimedVolume()).toFixed(1)}</>
          ) : (
            <>{totalDepositVolume()}</>
          )}
        </td>
        <td className='px-2 pb-2 text-center'>
          {claimant ? (
            <>{claimantPercent()} %</>
          ) : claimants ? (
            <>{(claimedVolume() / totalDepositVolume()) * 100} %</>
          ) : stillClaim ? (
            <>{(parseFloat((totalDepositVolume() - claimedVolume()) / totalDepositVolume()) * 100).toFixed(1)} %</>
          ) : (
            <div>100 %</div>
          )}
        </td>
        <td className='px-2 pb-2 text-center'>
          {claimant ? (
            <>{appState.utils.formatter.format(claimantBalances())}</>
          ) : claimants ? (
            <>{appState.utils.formatter.format(claimedBalances())}</>
          ) : stillClaim ? (
            <>{appState.utils.formatter.format(stillClaimable())}</>
          ) : (
            <>{appState.utils.formatter.format(totalDepositBalance())}</>
          )}
        </td>
      </td>
    </div>
  );
};

export default ClaimPerToken;
