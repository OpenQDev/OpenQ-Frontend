import React, { useContext, useMemo } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';

const ClaimTotals = ({ bounty, claimant, claimants, stillClaim, refundable }) => {
  const [appState] = useContext(StoreContext);

  const getBalancesStillClaimable = () => {
    return bounty.bountyTokenBalances ? bounty.bountyTokenBalances : null;
  };
  const balanceObjStillClaimable = useMemo(() => getBalancesStillClaimable(), [bounty]);
  const [balanceValuesStillClaimable] = useGetTokenValues(balanceObjStillClaimable);
  const stillClaimableValue = balanceValuesStillClaimable?.total;

  const getBalancesDeposits = () => {
    return bounty.deposits ? bounty.deposits : null;
  };
  const balanceObjDeposits = useMemo(() => getBalancesDeposits(), [bounty]);
  const [balanceValuesDeposits] = useGetTokenValues(balanceObjDeposits);
  const totalDepositValue = balanceValuesDeposits?.total + stillClaimableValue;

  const claimantTotalValue = () => {
    const getBalances = () => {
      return claimant ? bounty.payouts.filter((payout) => payout.closer.id == claimant) : null;
    };
    const balanceObj = useMemo(() => getBalances(), [claimant]);
    const [balanceValues] = useGetTokenValues(balanceObj);
    return balanceValues?.total;
  };

  const claimantsTotalValue = () => {
    const payouts = claimants ? bounty.payouts : null;
    const claims = [];
    let i;
    for (i = 0; i < payouts?.length; i++) {
      const balanceObj = useMemo(() => payouts[i], [bounty]);
      const [balanceValues] = useGetTokenValues(balanceObj);
      claims.push(balanceValues?.total);
    }
    return claims.reduce((a, b) => a + b);
  };

  const divStyle = 'flex justify-end w-16';

  return (
    <td className='flex gap-2 px-2 pb-2 w-full'>
      <td className='px-2 pb-2'>
        {claimant ? (
          <div className={divStyle}>{parseFloat((claimantTotalValue() / totalDepositValue) * 100).toFixed(1)} %</div>
        ) : claimants ? (
          <div className={divStyle}>{parseFloat((claimantsTotalValue() / totalDepositValue) * 100).toFixed(1)} %</div>
        ) : stillClaim ? (
          <div className={divStyle}>
            {bounty.payouts ? (
              <div>{parseFloat((stillClaimableValue / totalDepositValue) * 100).toFixed(1)} %</div>
            ) : (
              '0.0'
            )}
          </div>
        ) : refundable ? (
          <div className={divStyle}>Refund</div>
        ) : (
          <div className={divStyle}>100 %</div>
        )}
      </td>
      <td className='px-2 pb-2 w-full'>
        {claimant ? (
          <div className={divStyle}>{appState.utils.formatter.format(claimantTotalValue())}</div>
        ) : claimants ? (
          <div className={divStyle}>{appState.utils.formatter.format(claimantsTotalValue())}</div>
        ) : stillClaim ? (
          <div className={divStyle}>
            {bounty.payouts ? <>{appState.utils.formatter.format(stillClaimableValue)}</> : '0.0'}
          </div>
        ) : refundable ? (
          <div className={divStyle}>Refund</div>
        ) : (
          <div className={divStyle}>
            {bounty.deposits ? <>{appState.utils.formatter.format(totalDepositValue)}</> : '0.0'}
          </div>
        )}
      </td>
    </td>
  );
};

export default ClaimTotals;
