import React, { useContext, useMemo, useEffect } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import { ethers } from 'ethers';

const ClaimPerToken = ({ bounty, tokenAddress, claimant, type, changeObj }) => {
  const [appState] = useContext(StoreContext);
  const tokenMetadata = appState.tokenClient.getToken(tokenAddress);

  function formatVolume(volume) {
    const decimal = parseInt(tokenMetadata.decimals) || 18;
    let bigNumberVolume = ethers.BigNumber.from(volume.toLocaleString('fullwide', { useGrouping: false }));
    return ethers.utils.formatUnits(bigNumberVolume, decimal);
  }

  function filterAndAggregate(toFilterPerToken) {
    const array = toFilterPerToken.filter((element) => element.tokenAddress == tokenAddress);
    const volume =
      array.map((element) => element.volume).reduce((a, b) => parseInt(a) + parseInt(b), 0) || array[0]?.volume;
    return { tokenAddress: tokenAddress, volume: volume } || null;
  }

  const claimantBalancesObj = useMemo(
    () => filterAndAggregate(bounty.payouts.filter((payout) => payout.closer.id == claimant)),
    [claimant, tokenAddress]
  );
  const [claimantBalances] = useGetTokenValues(claimantBalancesObj);
  const claimantVolume = formatVolume(claimantBalancesObj?.volume || 0);
  const claimantValue = claimantBalances?.total;

  const unlockedDepositsObj = useMemo(
    () =>
      filterAndAggregate(
        bounty.deposits
          ?.filter((deposit) => !deposit.refunded)
          .filter((deposit) => {
            return parseInt(deposit.receiveTime) + parseInt(deposit.expiration) < Math.floor(Date.now() / 1000);
          })
      ),
    [bounty]
  );
  const [unlockedDepositsValues] = useGetTokenValues(unlockedDepositsObj);
  const unlockedDepositVolume = formatVolume(unlockedDepositsObj?.volume || 0);
  const unlockedDepositValue = unlockedDepositsValues?.total;

  const claimedBalancesObj = useMemo(() => filterAndAggregate(bounty.payouts), [bounty]);
  const [balanceValuesclaimedBalances] = useGetTokenValues(claimedBalancesObj);
  const claimedVolume = formatVolume(claimedBalancesObj?.volume || 0);
  const claimedBalances = balanceValuesclaimedBalances?.total;

  const refundableVolume = () => {
    const refundable =
      parseFloat(claimedVolume) > parseFloat(unlockedDepositVolume) ? 0 : unlockedDepositVolume - claimedVolume;
    return parseFloat(refundable).toFixed(1);
  };

  const refundableValue = () => {
    const refundable = claimedBalances > unlockedDepositValue ? 0 : unlockedDepositValue - claimedBalances;
    return refundable;
  };

  const stillClaimableObj = useMemo(() => filterAndAggregate(bounty.bountyTokenBalances), [tokenAddress]);
  const [stillClaimableValues] = useGetTokenValues(stillClaimableObj);
  const stillClaimable = stillClaimableValues?.total ? stillClaimableValues?.total : 0;

  const refundedObj = useMemo(() => filterAndAggregate(bounty.refunds), [tokenAddress]);
  const [refundedValues] = useGetTokenValues(refundedObj);
  const refundVolume = formatVolume(refundedObj?.volume || 0);
  const refundedValue = refundedValues?.total ? refundedValues?.total : 0;

  const balanceObjDeposits = useMemo(() => filterAndAggregate(bounty.deposits), [bounty]);
  const [balanceValuesDeposits] = useGetTokenValues(balanceObjDeposits);
  const totalDepositVolume = formatVolume(balanceObjDeposits?.volume || 0);
  const totalDepositValue = balanceValuesDeposits?.total ? balanceValuesDeposits?.total : 0;

  const currentDepositVolume = totalDepositVolume - refundVolume;

  let volumeDisplay = 0;
  let percentDisplay = 0;
  let valueDisplay = 0;

  switch (type) {
    case 'perClaimant':
      volumeDisplay = claimantVolume;
      percentDisplay = claimantVolume / totalDepositVolume;
      valueDisplay = claimantValue;
      break;
    case 'allClaimants':
      volumeDisplay = claimedVolume;
      percentDisplay = claimedVolume / totalDepositVolume;
      valueDisplay = claimedBalances;
      break;
    case 'stillClaimable':
      volumeDisplay = parseFloat(currentDepositVolume - claimedVolume).toFixed(1);
      percentDisplay = parseFloat((currentDepositVolume - claimedVolume) / totalDepositVolume);
      valueDisplay = stillClaimable;
      break;
    case 'refundable':
      volumeDisplay = refundableVolume();
      percentDisplay = parseFloat(refundableVolume() / totalDepositVolume);
      valueDisplay = refundableValue();
      break;
    case 'refunded':
      volumeDisplay = refundVolume;
      percentDisplay = parseFloat(refundVolume / totalDepositVolume);
      valueDisplay = refundedValue;
      break;
    case 'total':
      volumeDisplay = totalDepositVolume;
      percentDisplay = 1;
      valueDisplay = totalDepositValue;
      break;
  }

  useEffect(() => {
    let didCancel;
    if (!didCancel) {
      changeObj(claimant || type, valueDisplay);
    }
    return () => (didCancel = true);
  }, [valueDisplay]);

  return (
    <div className='flex px-2 pb-2 w-full'>
      <div className='px-2 pb-2'>
        <div className='flex justify-end w-12'>{volumeDisplay}</div>
      </div>
      <div className='px-2 pb-2'>
        <div className='flex justify-end w-12'>{(percentDisplay * 100).toFixed(0)} %</div>
      </div>
      <div className='px-2 pb-2'>
        <div className='flex justify-end text-right w-20'>{appState.utils.formatter.format(valueDisplay)}</div>
      </div>
    </div>
  );
};

export default ClaimPerToken;
