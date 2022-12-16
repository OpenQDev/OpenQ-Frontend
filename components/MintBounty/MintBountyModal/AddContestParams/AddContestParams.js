import React, { useState, useEffect, useContext } from 'react';
import ToolTipNew from '../../../Utils/ToolTipNew';
import SetPayoutToken from './SetPayoutToken';
import SetTierValues from './SetTierValues/SetTierValues';
import MintContext from '../../MintContext';

const AddContestParams = () => {
  const [tier, setTier] = useState(3);
  const [tierArr, setTierArr] = useState(['0', '1', '2']);
  const [tierVolumes, setTierVolumes] = useState({ 0: 1, 1: 1, 2: 1 });
  const [currentSum, setCurrentSum] = useState(0);
  const [mintState, mintDispatch] = useContext(MintContext);
  const { category, finalTierVolumes } = mintState;

  const setFinalTierVolumes = (tierVolumes) => {
    const dispatch = {
      payload: tierVolumes,
      type: 'UPDATE_FINAL_TIER_VOLUMES',
    };
    mintDispatch(dispatch);
  };

  const noop = () => {
    return null;
  };

  const sum = finalTierVolumes.reduce((a, b) => a + b);

  useEffect(() => {
    if (finalTierVolumes.length) {
      setCurrentSum(
        finalTierVolumes.reduce((a, b) => {
          if (a && b) {
            return a + b;
          }
          if (a) {
            return a;
          }
          if (b) {
            return b;
          }
          return 0;
        })
      );
    }
  }, [finalTierVolumes]);

  function onTierChange(e) {
    if (parseInt(e.target.value) >= 0) {
      setTier(parseInt(e.target.value));
    }
    if (parseInt(e.target.value) > 100) {
      setTier('1');
    }
    if (e.target.value === '' || isNaN(parseInt(e.target.value))) {
      return;
    }
    const newTierArr = Array.from({ length: e.target.value }, (_, i) => i);
    setTierArr(newTierArr);
    const newTierVolumes = {};
    newTierArr.forEach((tier) => {
      newTierVolumes[tier] = tierVolumes[tier] || 1;
    });

    setTierVolumes(newTierVolumes);
  }

  return (
    <div className='items-center py-2'>
      <div className=' w-11/12 text-base flex flex-col gap-2'>
        <div className='flex items-center gap-2 font-semibold'>
          How many Tiers?
          <ToolTipNew mobileX={10} toolTipText={"How many people will be able to claim a prize? Don't exceed 100."}>
            <div className='cursor-help rounded-full border border-[#c9d1d9] text-sm aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
              ?
            </div>
          </ToolTipNew>
        </div>
        <input
          className={'flex-1 input-field w-full'}
          id='name'
          aria-label='tiers'
          placeholder='0'
          autoComplete='off'
          defaultValue={3}
          type='text'
          min='0'
          max='100'
          onChange={(e) => onTierChange(e)}
        />
      </div>
      <SetPayoutToken
        content={{
          body: 'Which token?',
          message: 'Fixed contests can only be funded with one token.',
        }}
      />

      {tier > 0 ? (
        <SetTierValues
          category={category}
          sum={sum}
          currentSum={currentSum}
          finalTierVolumes={finalTierVolumes}
          setFinalTierVolumes={setFinalTierVolumes}
          tierArr={tierArr}
          setSum={noop}
          setEnableContest={noop}
          initialVolumes={['1', '1', '1']}
        />
      ) : null}
    </div>
  );
};
export default AddContestParams;
