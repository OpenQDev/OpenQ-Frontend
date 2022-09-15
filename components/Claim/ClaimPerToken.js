import React, { useContext, useMemo } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import { ethers } from 'ethers';

const ClaimPerToken = ({ bounty, tokenAddress, claimant, claimants, stillClaim, refundable }) => {
  const [appState] = useContext(StoreContext);
  const tokenMetadata = appState.tokenClient.getToken(tokenAddress);

  const claimantVolume = () => {
    const volume = bounty.payouts?.filter(
      (payout) => payout.closer.id == claimant && payout.tokenAddress == tokenAddress
    )[0].volume;
    let bigNumberVolume = ethers.BigNumber.from(volume.toString());
    let decimals = parseInt(tokenMetadata.decimals) || 18;
    return ethers.utils.formatUnits(bigNumberVolume, decimals);
  };

  const claimantPercent = () => {
    return (claimantVolume(claimant, tokenAddress) / totalDepositVolume(tokenAddress)) * 100;
  };

  const getClaimantBalances = () => {
    return claimant
      ? bounty.payouts.filter((payout) => payout.closer.id == claimant && payout.tokenAddress == tokenAddress)
      : null;
  };
  const claimantBalancesObj = useMemo(() => getClaimantBalances(), [claimant, tokenAddress]);
  const [claimantBalancesValues] = useGetTokenValues(claimantBalancesObj);
  const claimantBalances = claimantBalancesValues?.total;

  const claimedVolume = () => {
    const claimedVolume = bounty.payouts
      ?.filter((payout) => payout.tokenAddress == tokenAddress)
      .map((payout) => payout.volume)
      .reduce((a, b) => parseInt(a) + parseInt(b));
    let bigNumberclaimedVolume = ethers.BigNumber.from(
      claimedVolume.toLocaleString('fullwide', { useGrouping: false })
    );
    let decimals = parseInt(tokenMetadata.decimals) || 18;
    return ethers.utils.formatUnits(bigNumberclaimedVolume, decimals);
  };

  const unlockedDepositVolume = () => {
    const volumeArr = bounty.deposits.length
      ? bounty.deposits
          ?.filter((deposit) => deposit.tokenAddress == tokenAddress && !deposit.refunded)
          ?.filter((deposit) => {
            return parseInt(deposit.receiveTime) + parseInt(deposit.expiration) < Math.floor(Date.now() / 1000);
          })
          ?.map((deposit) => deposit.volume)
      : 0;
    const volume = volumeArr == 0 ? 0 : volumeArr.reduce((a, b) => parseInt(a) + parseInt(b));
    let bigNumberVolume = ethers.BigNumber.from(volume.toLocaleString('fullwide', { useGrouping: false }));
    let decimals = parseInt(tokenMetadata.decimals) || 18;
    return ethers.utils.formatUnits(bigNumberVolume, decimals);
  };

  const refundableVolume = () => {
    const refundable = claimedVolume() > unlockedDepositVolume() ? 0 : unlockedDepositVolume() - claimedVolume();
    return refundable.toFixed(1);
  };

  const payoutsClaimedBalances = bounty.payouts
    ? bounty.payouts.filter((payout) => payout.tokenAddress == tokenAddress)
    : null;
  const claimsClaimedBalances = bounty.payouts ? [] : 0;
  let i;
  for (i = 0; i < payoutsClaimedBalances?.length; i++) {
    const claimedBalancesObj = useMemo(() => payoutsClaimedBalances[i], [bounty]);
    const [balanceValuesclaimedBalances] = useGetTokenValues(claimedBalancesObj);
    claimsClaimedBalances.push(balanceValuesclaimedBalances?.total);
  }
  const claimedBalances = claimsClaimedBalances ? claimsClaimedBalances.reduce((a, b) => a + b) : 0;

  const unlockedDeposits = bounty.deposits
    ?.filter((deposit) => deposit.tokenAddress == tokenAddress && !deposit.refunded)
    .filter((deposit) => {
      return parseInt(deposit.receiveTime) + parseInt(deposit.expiration) < Math.floor(Date.now() / 1000);
    });
  const depValues = bounty.deposits ? [] : 0;
  let j;
  for (j = 0; j < unlockedDeposits?.length; j++) {
    const unlockedDepositsObj = useMemo(() => unlockedDeposits[j], [bounty]);
    const [unlockedDepositsValues] = useGetTokenValues(unlockedDepositsObj);
    depValues.push(unlockedDepositsValues?.total);
  }
  const unlockedDepositValue = depValues == 0 ? 0 : depValues.reduce((a, b) => a + b);

  const refundableValue = () => {
    const refundable = claimedBalances > unlockedDepositValue ? 0 : unlockedDepositValue - claimedBalances;
    return refundable;
  };

  const getStillClaimableBalances = () => {
    return bounty.bountyTokenBalances
      ? bounty.bountyTokenBalances.filter((balances) => balances.tokenAddress == tokenAddress)
      : null;
  };
  const stillClaimableObj = useMemo(() => getStillClaimableBalances(), [tokenAddress]);
  const [stillClaimableValues] = useGetTokenValues(stillClaimableObj);
  const stillClaimable = stillClaimableValues?.total;

  const totalDepositVolume = () => {
    const volume = bounty.deposits
      .filter((deposit) => deposit.tokenAddress == tokenAddress)
      .map((deposit) => deposit.volume)
      .reduce((a, b) => parseInt(a) + parseInt(b));
    let bigNumberVolume = ethers.BigNumber.from(volume.toLocaleString('fullwide', { useGrouping: false }));
    let decimals = parseInt(tokenMetadata.decimals) || 18;
    return ethers.utils.formatUnits(bigNumberVolume, decimals);
  };

  const divVolume = 'flex justify-end w-12';
  const divPercent = 'flex justify-end w-12';
  const divValue = 'flex justify-end text-right w-20';

  return (
    <td className='flex px-2 pb-2 w-full'>
      <td className='px-2 pb-2'>
        {claimant ? (
          <div className={divVolume}>{claimantVolume()}</div>
        ) : claimants ? (
          <div className={divVolume}>{claimedVolume()}</div>
        ) : stillClaim ? (
          <div className={divVolume}>{parseFloat(totalDepositVolume() - claimedVolume()).toFixed(1)}</div>
        ) : refundable ? (
          <div className={divVolume}>
            <div>{refundableVolume()}</div>
          </div>
        ) : (
          <div className={divVolume}>{totalDepositVolume()}</div>
        )}
      </td>
      <td className='px-2 pb-2'>
        {claimant ? (
          <div className={divPercent}>{claimantPercent()} %</div>
        ) : claimants ? (
          <div className={divPercent}>{(claimedVolume() / totalDepositVolume()) * 100} %</div>
        ) : stillClaim ? (
          <div className={divPercent}>
            {(parseFloat((totalDepositVolume() - claimedVolume()) / totalDepositVolume()) * 100).toFixed(1)} %
          </div>
        ) : refundable ? (
          <div className={divPercent}>
            <div>{(parseFloat(refundableVolume() / totalDepositVolume()) * 100).toFixed(1)} %</div>
          </div>
        ) : (
          <div className={divPercent}>100 %</div>
        )}
      </td>
      <td className='px-2 pb-2'>
        {claimant ? (
          <div className={divValue}>{appState.utils.formatter.format(claimantBalances)}</div>
        ) : claimants ? (
          <div className={divValue}>{appState.utils.formatter.format(claimedBalances)}</div>
        ) : stillClaim ? (
          <div className={divValue}>{appState.utils.formatter.format(stillClaimable)}</div>
        ) : refundable ? (
          <div className={divValue}>
            <div>{appState.utils.formatter.format(refundableValue())}</div>
          </div>
        ) : (
          <div className={divValue}>{appState.utils.formatter.format(stillClaimable + claimedBalances)}</div>
        )}
      </td>
    </td>
  );
};

export default ClaimPerToken;
