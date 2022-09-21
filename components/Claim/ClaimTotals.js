import React, { useContext, useMemo } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';

const ClaimTotals = ({ bounty, tokenAddresses, claimant, type }) => {
  const [appState] = useContext(StoreContext);

  function filterAndAggregate(toFilterPerToken) {
    return tokenAddresses.map((tokenAddress) => {
      const array = toFilterPerToken.filter((element) => element.tokenAddress == tokenAddress);
      const volume =
        array.map((element) => element.volume).reduce((a, b) => parseInt(a) + parseInt(b), 0) || array[0]?.volume;
      return { tokenAddress: tokenAddress, volume: volume } || null;
    });
  }

  const getBalancesStillClaimable = () => {
    return bounty.bountyTokenBalances ? bounty.bountyTokenBalances : null;
  };
  const balanceObjStillClaimable = useMemo(() => getBalancesStillClaimable(), [bounty]);
  const [balanceValuesStillClaimable] = useGetTokenValues(balanceObjStillClaimable);
  const stillClaimableValue = balanceValuesStillClaimable?.total ? balanceValuesStillClaimable?.total : 0;

  const balanceObjDeposits = useMemo(() => filterAndAggregate(bounty.deposits), [bounty]);
  const [balanceValuesDeposits] = useGetTokenValues(balanceObjDeposits);
  const totalDepositValue = balanceValuesDeposits?.total ? balanceValuesDeposits?.total : 0;
  console.log(totalDepositValue);

  const getBalancesRefunds = () => {
    return bounty.refunds ? bounty.refunds : null;
  };
  const balanceObjRefunds = useMemo(() => getBalancesRefunds(), [bounty]);
  const [balanceValuesRefunds] = useGetTokenValues(balanceObjRefunds);
  const refundValue = balanceValuesRefunds?.total ? balanceValuesRefunds?.total : 0;

  const claimantTotalValueObj = useMemo(
    () => filterAndAggregate(bounty.payouts.filter((payout) => payout.closer.id == claimant)),
    [claimant]
  );
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
