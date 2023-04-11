import React, { useContext, useEffect, useState } from 'react';
import ToolTipNew from '../../../Utils/ToolTipNew';
import TokenFundBox from '../../../TokenSelection/TokenFundBox';
import { ethers } from 'ethers';
import { parseVolume } from '../../../../services/utils/lib';
import MintContext from '../../MintContext';
import TokenContext from '../../../TokenSelection/TokenStore/TokenContext';

const Budgeting = () => {
  const [budget, setBudget] = useState();
  const [mintState, mintDispatch] = useContext(MintContext);
  const { goalToken, goalVolume, type } = mintState;
  const [tokenState] = useContext(TokenContext);
  const { token } = tokenState;

  const handleGoalChange = (goalVolume) => {
    const dispatch = {
      type: 'UPDATE_GOAL_VOLUME',
      payload: goalVolume,
    };
    mintDispatch(dispatch);

    const parsedGoalVolume = parseVolume(goalVolume);
    if (parsedGoalVolume !== null) {
      mintDispatch(parsedGoalVolume);
    }
  };
  useEffect(() => {
    const dispatch = {
      type: 'UPDATE_GOAL_TOKEN',
      payload: { ...token, address: ethers.utils.getAddress(token.address) },
    };
    mintDispatch(dispatch);
  }, [JSON.stringify(token)]);

  return (
    <>
      {type !== 3 && (
        <div className=' flex flex-col gap-2 w-full py-2 items-start text-base bg-[#161B22]'>
          <div className='flex items-center gap-2 font-semibold'>
            Set a Budget
            <input type='checkbox' className='checkbox' onChange={() => setBudget(!budget)}></input>
            <ToolTipNew
              innerStyles={'w-40 whitespace-normal'}
              toolTipText={
                type === 0 || type === 1
                  ? 'Amount of funds you would like to escrow on this issue.'
                  : 'How much will each successful submitter earn?'
              }
            >
              <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
                ?
              </div>
            </ToolTipNew>
          </div>
          <span className='text-sm '>
            You don{"'"}t have to deposit now! The budget is just what you intend to pay.
          </span>
          {budget ? (
            <div className='flex-1 w-full'>
              <TokenFundBox
                small={true}
                label='budget'
                onVolumeChange={handleGoalChange}
                volume={goalVolume}
                token={goalToken}
                styles={'flex-col sm:flex-row space-y-4 space-x-0 sm:space-x-4 sm:space-y-0'}
              />
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};
export default Budgeting;
