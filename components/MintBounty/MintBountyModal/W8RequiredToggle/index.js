import React, { useContext } from 'react';
import SmallToggle from '../../../Utils/SmallToggle';
import ToolTipNew from '../../../Utils/ToolTipNew';
import MintContext from '../../MintContext';
import { getBool, reverseBool } from '../../../../services/utils/lib';

const W8RequiredToggle = () => {
  const [mintState, mintDispatch] = useContext(MintContext);
  const { w8Required } = mintState;

  const setW8Required = (w8Required) => {
    const boolVal = getBool(w8Required);
    const dispatch = {
      payload: boolVal,
      type: 'SET_W8_REQUIRED',
    };
    mintDispatch(dispatch);
  };
  return (
    <div className='flex flex-col  gap-2 py-2 w-full items-start  text-base bg-[#161B22]'>
      <div className='flex items-center gap-2 font-semibold'>
        Does this Contract require a W8?
        <ToolTipNew
          innerStyles={'w-40 whitespace-normal'}
          outerStyles={'-top-1 '}
          toolTipText={
            'Set a W8 form as a requirement for claiming the bounty, which must be reviewed and accepted by you.'
          }
        >
          <div className='cursor-help rounded-full border border-[#c9d1d9] text-sm aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
            ?
          </div>
        </ToolTipNew>
      </div>
      <div className='flex-1 w-full'>
        <div className='flex text-sm rounded-sm text-primary '>
          <SmallToggle toggleVal={reverseBool(w8Required)} names={['Yes', 'No']} toggleFunc={setW8Required} />
        </div>
        <span className='note'>Note: crowdfunding is not available on contracts for which W8 form is required.</span>
      </div>
    </div>
  );
};

export default W8RequiredToggle;
