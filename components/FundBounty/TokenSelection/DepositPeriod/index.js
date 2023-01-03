import React, { useContext } from 'react';
import ToolTipNew from '../../../Utils/ToolTipNew';
import FundContext from '../../FundStore/FundContext';
const DepositPeriod = () => {
  const [fundState, fundDispatch] = useContext(FundContext);

  const handleDayChange = (e) => {
    const { value } = e.target;
    const dispatch = {
      type: 'SET_DEPOSIT_PERIOD_DAYS',
      payload: value,
    };
    fundDispatch(dispatch);
  };

  const { depositPeriodDays } = fundState;
  return (
    <div className='flex w-full input-field-big mb-4'>
      <div className=' flex items-center gap-3 w-full text-primary md:whitespace-nowrap'>
        <ToolTipNew
          relativePosition={'md:-left-12'}
          outerStyles={'-top-1'}
          groupStyles={''}
          innerStyles={'whitespace-normal md:w-96 sm:w-60 w-40  '}
          toolTipText={
            'This is the number of days that your deposit will be in escrow. After this many days, your deposit will be fully refundable if the contract has still not been claimed.'
          }
        >
          <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
            ?
          </div>
        </ToolTipNew>
        <span>Deposit Locked Period</span>
      </div>
      <div className={'flex px-4 font-bold bg-input-bg'}>
        <input
          className='text-primary text-right number outline-none w-full flex-1 bg-input-bg'
          autoComplete='off'
          value={depositPeriodDays}
          id='deposit-period'
          onChange={handleDayChange}
        />
      </div>
    </div>
  );
};
export default DepositPeriod;
