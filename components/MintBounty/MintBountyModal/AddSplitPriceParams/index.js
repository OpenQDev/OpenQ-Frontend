import React, { useContext, useEffect } from 'react';
import TokenFundBox from '../../../TokenSelection/TokenFundBox';
import { ethers } from 'ethers';
import ToolTipNew from '../../../Utils/ToolTipNew';
import MintContext from '../../MintContext';
import TokenContext from '../../../TokenSelection/TokenStore/TokenContext';
import { parseVolume } from '../../../../services/utils/lib';

const AddSplitPriceParams = () => {
  const [mintState, mintDispatch] = useContext(MintContext);
  const { payoutVolume } = mintState;
  const [tokenState] = useContext(TokenContext);
  const { token } = tokenState;
  const onVolumeChange = (payoutVolume) => {
    const parsedPayoutVolume = parseVolume(payoutVolume);
    const dispatch = {
      type: 'UPDATE_PAYOUT_VOLUME',
      payload: parsedPayoutVolume,
    };
    mintDispatch(dispatch);
  };

  useEffect(() => {
    const dispatch = {
      type: 'UPDATE_PAYOUT_TOKEN',
      payload: { ...token, address: ethers.utils.getAddress(token.address) },
    };
    mintDispatch(dispatch);
  }, [JSON.stringify(token)]);

  return (
    <div className='flex flex-col gap-2 w-full items-start py-2 pb-4 text-base bg-[#161B22]'>
      <div className='flex items-center gap-2 font-semibold'>
        Reward Split?
        <ToolTipNew
          innerStyles={'w-40 whitespace-normal'}
          toolTipText={'How much will each successful submitter earn?'}
        >
          <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square text-sm leading-4 h-4 box-content text-center font-bold text-primary'>
            ?
          </div>
        </ToolTipNew>
      </div>
      <div className='flex-1 w-full'>
        <TokenFundBox
          small={true}
          label='split'
          onVolumeChange={onVolumeChange}
          volume={payoutVolume}
          styles={'flex-col sm:flex-row space-y-4 space-x-0 sm:space-x-4 sm:space-y-0'}
        />
      </div>
    </div>
  );
};

export default AddSplitPriceParams;
