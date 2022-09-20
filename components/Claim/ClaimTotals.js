import React, { useContext, useMemo } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';

const ClaimTotals = ({ bounty, tokenAddresses, claimant, type }) => {
  const [appState] = useContext(StoreContext);

  const getBalancesStillClaimable = () => {
    return bounty.bountyTokenBalances ? bounty.bountyTokenBalances : null;
  };
  const balanceObjStillClaimable = useMemo(() => getBalancesStillClaimable(), [bounty]);
  const [balanceValuesStillClaimable] = useGetTokenValues(balanceObjStillClaimable);
  const stillClaimableValue = balanceValuesStillClaimable?.total ? balanceValuesStillClaimable?.total : 0;

  const getBalancesDeposits = () => {
    return tokenAddresses.map((tokenAddress) => {
      const deposits = bounty.deposits
        ? bounty.deposits.filter((deposit) => deposit.tokenAddress == tokenAddress)
        : null;
      if (deposits.length > 1) {
        const volume = deposits.map((deposit) => deposit.volume).reduce((a, b) => parseInt(a) + parseInt(b));
        return { tokenAddress: tokenAddress, volume: volume };
      }
      return { tokenAddress: tokenAddress, volume: deposits[0].volume };
    });
  };
  const balanceObjDeposits = useMemo(() => getBalancesDeposits(), [bounty]);
  const [balanceValuesDeposits] = useGetTokenValues(balanceObjDeposits);
  const totalDepositValue = balanceValuesDeposits?.total ? balanceValuesDeposits?.total : 0;

  const getBalancesRefunds = () => {
    return bounty.refunds ? bounty.refunds : null;
  };
  const balanceObjRefunds = useMemo(() => getBalancesRefunds(), [bounty]);
  const [balanceValuesRefunds] = useGetTokenValues(balanceObjRefunds);
  const refundValue = balanceValuesRefunds?.total ? balanceValuesRefunds?.total : 0;

  const getClaimantTotalValueBalances = () => {
    const payouts = claimant
      ? tokenAddresses.map((tokenAddress) => {
          const payouts = bounty.payouts
            ? bounty.payouts.filter((payout) => payout.closer.id == claimant && payout.tokenAddress == tokenAddress)
            : null;
          if (payouts.length > 1) {
            const volume = payouts.map((payout) => payout.volume).reduce((a, b) => parseInt(a) + parseInt(b));
            return { tokenAddress: tokenAddress, volume: volume };
          } else {
            return { tokenAddress: tokenAddress, volume: payouts[0].volume };
          }
        })
      : null;
    return payouts;
  };
  const claimantTotalValueObj = useMemo(() => getClaimantTotalValueBalances(), [claimant]);
  const [claimantTotalValues] = useGetTokenValues(claimantTotalValueObj);
  const claimantTotalValue = claimantTotalValues?.total ? claimantTotalValues?.total : 0;

  const payouts = bounty.payouts ? bounty.payouts : null;
  const claims = bounty.payouts ? [] : 0;
  let i;
  for (i = 0; i < payouts?.length; i++) {
    const claimantsTotalObj = useMemo(() => payouts[i], [bounty]);
    const [claimantsTotalValues] = useGetTokenValues(claimantsTotalObj);
    claims.push(claimantsTotalValues?.total);
  }
  const claimantsTotalValue = claims ? claims.reduce((a, b) => a + b) : 0;

  const unlockedDeposits = bounty.deposits?.filter((deposit) => {
    return parseInt(deposit.receiveTime) + parseInt(deposit.expiration) < Math.floor(Date.now() / 1000);
  });
  const depValues = bounty.deposits ? [] : 0;
  let j;
  for (j = 0; j < unlockedDeposits?.length; j++) {
    const unlockedDepositsObj = useMemo(() => unlockedDeposits[j], [bounty]);
    const [unlockedDepositsValues] = useGetTokenValues(unlockedDepositsObj);
    depValues.push(unlockedDepositsValues?.total);
  }
  const unlockedDepositValue = depValues ? depValues.reduce((a, b) => a + b) : 0;

  const refundableValue =
    unlockedDepositValue - claimantsTotalValue - refundValue < 0
      ? 0
      : unlockedDepositValue - claimantsTotalValue - refundValue;

  console.log(unlockedDepositValue, claimantsTotalValue, refundValue, refundableValue);

  const divPercent = 'flex justify-end w-16';
  const divValue = 'flex justify-end';

  let percentDisplay = 0;
  let valueDisplay = 0;

  switch (type) {
    case 'perClaimant':
      percentDisplay = parseFloat(claimantTotalValue / totalDepositValue);
      valueDisplay = claimantTotalValue;
      break;
    case 'allClaimants':
      percentDisplay = parseFloat(claimantsTotalValue / totalDepositValue);
      valueDisplay = claimantsTotalValue;
      break;
    case 'stillClaimable':
      percentDisplay = bounty.payouts ? parseFloat(stillClaimableValue / totalDepositValue) : 0;
      valueDisplay = stillClaimableValue;
      break;
    case 'refundable':
      percentDisplay = parseFloat(refundableValue / totalDepositValue);
      valueDisplay = refundableValue;
      break;
    case 'refunded':
      percentDisplay = parseFloat(refundValue / totalDepositValue);
      valueDisplay = refundValue;
      break;
    case 'total':
      percentDisplay = 1;
      valueDisplay = totalDepositValue;
      break;
  }

  return (
    <div className='flex gap-2 px-2 pb-2 w-full'>
      <div className='px-2 pb-2'>
        <div className={divPercent}>{(percentDisplay * 100).toFixed(1)} %</div>
      </div>
      <div className='px-2 pb-2 w-full'>
        <div className={divValue}>{appState.utils.formatter.format(valueDisplay)}</div>
      </div>
    </div>
  );
};

export default ClaimTotals;
