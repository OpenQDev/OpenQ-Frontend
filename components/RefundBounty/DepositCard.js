// Third party
import React, { useContext, useState } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import TokenBalances from '../TokenBalances/TokenBalances';
import ToolTipNew from '../Utils/ToolTipNew';
const DepositCard = ({
  deposit,
  refundBounty,
  extendBounty,
  status,
  isOnCorrectNetwork,
  onDepositPeriodChanged,
  depositPeriodDays,
}) => {
  // Context
  const [appState] = useContext(StoreContext);

  // State
  const [tokenValues] = useGetTokenValues(deposit);

  const [expanded, setExpanded] = useState(false);

  return (
    <div className='flex flex-col items-center w-full md:border rounded-sm border-gray-700 text-primary'>
      <div className='flex justify-center w-full md:bg-[#161b22] md:border-b border-gray-700 pb-1 rounded-t-sm'>
        <TokenBalances lean={true} tokenBalances={deposit} tokenValues={tokenValues} singleCurrency={true} />
      </div>

      <div
        className={
          'pt-3 flex flex-col md:flex-row w-full items-center justify-between px-8 sm:px-6 pb-4 hover:bg-[#21262d]'
        }
      >
        <div className='flex flex-col space-y-2'>
          <div className='text-left  py-2'>
            Deposited on: {appState.utils.formatUnixDate(parseInt(deposit.receiveTime))}
          </div>
          {deposit.refunded ? (
            <div className='text-left  pb-2'>
              Refunded on: {appState.utils.formatUnixDate(parseInt(deposit.refundTime))}
            </div>
          ) : (
            <div className='text-left  pb-2'>
              Refundable on:{' '}
              {appState.utils.formatUnixDate(parseInt(deposit.receiveTime) + parseInt(deposit.expiration))}
            </div>
          )}
        </div>
        
          <div className='flex flex-col space-y-3 w-44 pl-3 text-primary'>
          {status === 'refundable' && (
            <ToolTipNew
              outerStyles='flex'
              hideToolTip={isOnCorrectNetwork}
              toolTipText={'Please switch to the correct network to refund this deposit.'}
            >
              <button
                onClick={() => refundBounty(deposit.id)}
                disabled={!isOnCorrectNetwork}
                className={`${isOnCorrectNetwork ? 'btn-default w-full' : 'btn-default cursor-not-allowed w-full'}`}
              >
                Refund
              </button>
            </ToolTipNew>
          )}
            {expanded ? (
              <div className=' text-primary flex flex-col md:flex-row md:space-x-2 items-center'>
                <div className='flex w-full input-field-big pl-4 justify-between'>
                  <div className=' flex items-center'>
                    <ToolTipNew
                      innerStyles={'whitespace-normal w-80'}
                      toolTipText={
                        "This is the number of days that your deposit will be in escrow. After this many days, you're deposit will be fully refundable if the bounty has still not been claimed."
                      }
                    >
                      <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
                        ?
                      </div>
                    </ToolTipNew>
                  </div>

                  <input
                    className='flex w-full md:w-12 text-primary text-right number outline-none bg-dark-mode'
                    autoComplete='off'
                    value={depositPeriodDays || 0}
                    name={deposit.id}
                    id='deposit-period'
                    onChange={onDepositPeriodChanged}
                    placeholder='0'
                  />
                </div>
                <ToolTipNew
                  outerStyles='flex w-full items-center'
                  hideToolTip={isOnCorrectNetwork && depositPeriodDays > 0}
                  toolTipText={
                    !isOnCorrectNetwork
                      ? 'Please switch to the correct network to extend this bounty.'
                      : !(depositPeriodDays > 0)
                      ? "Please indicate how many days you'd like to extend your bounty for."
                      : null
                  }
                >
                  <button
                    onClick={() => extendBounty(deposit.id)}
                    disabled={!isOnCorrectNetwork || !(depositPeriodDays > 0)}
                    className={`flex mt-3 md:mt-0 text-center w-full px-3 justify-center ${
                      isOnCorrectNetwork && depositPeriodDays > 0
                        ? 'btn-primary cursor-pointer p-1'
                        : 'btn-default cursor-not-allowed'
                    }`}
                  >
                    Extend
                  </button>
                </ToolTipNew>
              </div>
            ) : (
              <ToolTipNew
                outerStyles='flex self-center'
                hideToolTip={isOnCorrectNetwork}
                toolTipText={'Please switch to the correct network to refund this deposit.'}
              >
                <button
                  onClick={() => setExpanded(!expanded)}
                  disabled={!isOnCorrectNetwork}
                  className={`${isOnCorrectNetwork ? 'btn-default w-full' : 'btn-default cursor-not-allowed w-full'}`}
                >
                  Extend
                </button>
              </ToolTipNew>
            )}
          </div>
        
      </div>
    </div>
  );
};

export default DepositCard;
