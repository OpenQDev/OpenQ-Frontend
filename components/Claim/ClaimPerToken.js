import React, { useContext, useMemo } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import { ethers } from 'ethers';

const ClaimPerToken = ({ bounty, tokenAddress, claimant, claimants, stillClaim, refundable }) => {
  const [appState] = useContext(StoreContext);

  const claimantVolume = () => {
    const tokenMetadata = appState.tokenClient.getToken(tokenAddress);
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

  const unlockedDepositVolume = () => {
    const tokenMetadata = appState.tokenClient.getToken(tokenAddress);
    const volume = bounty.deposits
      ?.filter((deposit) => deposit.tokenAddress == tokenAddress && !deposit.refunded)
      .filter((deposit) => {
        return parseInt(deposit.receiveTime) + parseInt(deposit.expiration) < Math.floor(Date.now() / 1000);
      })
      .map((deposit) => deposit.volume)
      .reduce((a, b) => parseInt(a) + parseInt(b));
    let bigNumberVolume = ethers.BigNumber.from(volume.toLocaleString('fullwide', { useGrouping: false }));
    let decimals = parseInt(tokenMetadata.decimals) || 18;
    return ethers.utils.formatUnits(bigNumberVolume, decimals);
  };

  const refundableVolume = () => {
    const refundable = claimedVolume() > unlockedDepositVolume() ? 0 : unlockedDepositVolume() - claimedVolume();
    return refundable.toFixed(1);
  };

  const claimedBalances = () => {
    const payouts = bounty.payouts ? bounty.payouts.filter((payout) => payout.tokenAddress == tokenAddress) : null;
    const claims = bounty.payouts ? [] : 0;
    let i;
    for (i = 0; i < payouts?.length; i++) {
      const balanceObj = useMemo(() => payouts[i], [bounty]);
      const [balanceValues] = useGetTokenValues(balanceObj);
      claims.push(balanceValues?.total);
    }
    const final = claims ? claims.reduce((a, b) => a + b) : 0;
    return final;
  };

  const unlockedDepositValue = () => {
    const deposits = bounty.deposits
      ?.filter((deposit) => deposit.tokenAddress == tokenAddress && !deposit.refunded)
      .filter((deposit) => {
        return parseInt(deposit.receiveTime) + parseInt(deposit.expiration) < Math.floor(Date.now() / 1000);
      });
    const depValues = bounty.deposits ? [] : 0;
    let i;
    for (i = 0; i < deposits?.length; i++) {
      const balanceObj = useMemo(() => deposits[i], [bounty]);
      const [balanceValues] = useGetTokenValues(balanceObj);
      depValues.push(balanceValues?.total);
    }
    const final = depValues ? depValues.reduce((a, b) => a + b) : 0;
    return final;
  };

  const refundableValue = () => {
    const refundable = claimedBalances() > unlockedDepositValue() ? 0 : unlockedDepositValue() - claimedBalances();
    return refundable;
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

  const divVolume = 'flex justify-end w-12';
  const divPercent = 'flex justify-end w-12';
  const divValue = 'flex justify-end text-right w-20';

  // refundable = stillclaimable BUT not locked (expiration date passed)

  return (
    <td className='flex px-2 pb-2 w-full'>
      {console.log(unlockedDepositVolume())}
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
          <div className={divValue}>{appState.utils.formatter.format(claimantBalances())}</div>
        ) : claimants ? (
          <div className={divValue}>{appState.utils.formatter.format(claimedBalances())}</div>
        ) : stillClaim ? (
          <div className={divValue}>{appState.utils.formatter.format(stillClaimable())}</div>
        ) : refundable ? (
          <div className={divValue}>
            <div>{appState.utils.formatter.format(refundableValue())}</div>
          </div>
        ) : (
          <div className={divValue}>{appState.utils.formatter.format(stillClaimable() + claimedBalances())}</div>
        )}
      </td>
    </td>
  );
};

export default ClaimPerToken;
