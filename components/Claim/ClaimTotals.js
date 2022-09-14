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

  return (
    <div className='flex justify-end border border-red-400'>
      <td className='px-2 pb-2 text-center'>
        <td className='px-2 pb-2 text-center'>
          {claimant ? (
            <div>Claimant</div>
          ) : claimants ? (
            <div>Claimants</div>
          ) : stillClaim ? (
            <div>
              {bounty.payouts ? (
                <div>{parseFloat((stillClaimableValue / totalDepositValue) * 100).toFixed(1)} %</div>
              ) : (
                '0.0'
              )}
            </div>
          ) : refundable ? (
            <div>Refund</div>
          ) : (
            <div>100 %</div>
          )}
        </td>
        <td className='px-2 pb-2 text-center'>
          {claimant ? (
            <div>Claimant</div>
          ) : claimants ? (
            <div>Claimants</div>
          ) : stillClaim ? (
            <div>{bounty.payouts ? <div>{appState.utils.formatter.format(stillClaimableValue)}</div> : '0.0'}</div>
          ) : refundable ? (
            <div>Refund</div>
          ) : (
            <div>{bounty.deposits ? <div>{appState.utils.formatter.format(totalDepositValue)}</div> : '0.0'}</div>
          )}
        </td>
      </td>
    </div>
  );
};

export default ClaimTotals;
