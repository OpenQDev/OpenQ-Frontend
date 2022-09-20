import React, { useContext, useMemo } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import { ethers } from 'ethers';

const ClaimPerToken = ({ bounty, tokenAddress, claimant, type }) => {
  const [appState] = useContext(StoreContext);
  const tokenMetadata = appState.tokenClient.getToken(tokenAddress);
  const decimals = parseInt(tokenMetadata.decimals) || 18;

  const claimantVolume = () => {
    const volumeArr = bounty.payouts?.filter(
      (payout) => payout.closer.id == claimant && payout.tokenAddress == tokenAddress
    );
    let i;
    let transitArr = volumeArr ? [] : 0;
    for (i = 0; i < volumeArr.length; i++) {
      transitArr.push(volumeArr[i].volume);
    }
    const finVolume = transitArr == 0 ? 0 : transitArr.reduce((a, b) => parseInt(a) + parseInt(b));
    let bigNumberVolume = ethers.BigNumber.from(finVolume.toString());
    return ethers.utils.formatUnits(bigNumberVolume, decimals);
  };

  const getClaimantBalances = () => {
    const claimArr = claimant
      ? bounty.payouts
          .filter((payout) => payout.closer.id == claimant && payout.tokenAddress == tokenAddress)
          .map((claim) => claim.volume)
      : null;
    const vol = claimArr == null ? 0 : claimArr.reduce((a, b) => parseInt(a) + parseInt(b));
    return vol == 0 ? 0 : { tokenAddress: tokenAddress, volume: vol };
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
    return ethers.utils.formatUnits(bigNumberVolume, decimals);
  };

  const refundableVolume = () => {
    const refundable =
      parseFloat(claimedVolume()) > parseFloat(unlockedDepositVolume()) ? 0 : unlockedDepositVolume() - claimedVolume();
    return parseFloat(refundable).toFixed(1);
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
  const stillClaimable = stillClaimableValues?.total ? stillClaimableValues?.total : 0;

  const refundVolume = () => {
    const volumeArr = bounty.refunds
      ? bounty.refunds?.filter((refund) => refund.tokenAddress == tokenAddress)?.map((refund) => refund.volume)
      : 0;
    const volume = volumeArr == 0 ? 0 : volumeArr.reduce((a, b) => parseInt(a) + parseInt(b));
    let bigNumberVolume = ethers.BigNumber.from(volume.toLocaleString('fullwide', { useGrouping: false }));
    return ethers.utils.formatUnits(bigNumberVolume, decimals);
  };

  const getRefundedBalances = () => {
    return bounty.refunds ? bounty.refunds.filter((refund) => refund.tokenAddress == tokenAddress) : null;
  };
  const refundedObj = useMemo(() => getRefundedBalances(), [tokenAddress]);
  const [refundedValues] = useGetTokenValues(refundedObj);
  const refundedValue = refundedValues?.total ? refundedValues?.total : 0;

  const totalDepositVolume = () => {
    const volume = bounty.deposits
      .filter((deposit) => deposit.tokenAddress == tokenAddress)
      .map((deposit) => deposit.volume)
      .reduce((a, b) => parseInt(a) + parseInt(b));
    let bigNumberVolume = ethers.BigNumber.from(volume.toLocaleString('fullwide', { useGrouping: false }));
    return ethers.utils.formatUnits(bigNumberVolume, decimals);
  };

  const getBalancesDeposits = () => {
    const deposits = bounty.deposits ? bounty.deposits.filter((deposit) => deposit.tokenAddress == tokenAddress) : null;
    if (deposits.length > 1) {
      const volume = deposits.map((deposit) => deposit.volume).reduce((a, b) => parseInt(a) + parseInt(b));
      return { tokenAddress: tokenAddress, volume: volume };
    }
    return deposits;
  };
  const balanceObjDeposits = useMemo(() => getBalancesDeposits(), [bounty]);
  const [balanceValuesDeposits] = useGetTokenValues(balanceObjDeposits);
  const totalDepositValue = balanceValuesDeposits?.total ? balanceValuesDeposits?.total : 0;

  const currentDepositVolume = totalDepositVolume() - refundVolume();

  let volumeDisplay = 0;
  let percentDisplay = 0;
  let valueDisplay = 0;

  switch (type) {
    case 'perClaimant':
      volumeDisplay = claimantVolume();
      percentDisplay = claimantVolume() / totalDepositVolume();
      valueDisplay = claimantBalances;
      break;
    case 'allClaimants':
      volumeDisplay = claimedVolume();
      percentDisplay = claimedVolume() / totalDepositVolume();
      valueDisplay = claimedBalances;
      break;
    case 'stillClaimable':
      volumeDisplay = parseFloat(currentDepositVolume - claimedVolume()).toFixed(1);
      percentDisplay = parseFloat((currentDepositVolume - claimedVolume()) / totalDepositVolume());
      valueDisplay = stillClaimable;
      break;
    case 'refundable':
      volumeDisplay = refundableVolume();
      percentDisplay = parseFloat(refundableVolume() / totalDepositVolume());
      valueDisplay = refundableValue();
      break;
    case 'refunded':
      volumeDisplay = refundVolume();
      percentDisplay = parseFloat(refundVolume() / totalDepositVolume());
      valueDisplay = refundedValue;
      break;
    case 'total':
      volumeDisplay = totalDepositVolume();
      percentDisplay = 1;
      valueDisplay = totalDepositValue;
      break;
  }

  const divVolume = 'flex justify-end w-12';
  const divPercent = 'flex justify-end w-12';
  const divValue = 'flex justify-end text-right w-20';

  return (
    <div className='flex px-2 pb-2 w-full'>
      <div className='px-2 pb-2'>
        <div className={divVolume}>{volumeDisplay}</div>
      </div>
      <div className='px-2 pb-2'>
        <div className={divPercent}>{(percentDisplay * 100).toFixed(0)} %</div>
      </div>
      <div className='px-2 pb-2'>
        <div className={divValue}>{appState.utils.formatter.format(valueDisplay)}</div>
      </div>
    </div>
  );
};

export default ClaimPerToken;
