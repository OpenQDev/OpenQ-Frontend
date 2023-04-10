import React, { useContext } from 'react';
import SmallToggle from '../../../Utils/SmallToggle';
import ToolTipNew from '../../../Utils/ToolTipNew';
import MintContext from '../../MintContext';
import { getBool, reverseBool } from '../../../../services/utils/lib';

const KycRequiredToggle = () => {
  const [mintState, mintDispatch] = useContext(MintContext);
  const { kycRequired } = mintState;
  const setKycRequired = (kycRequired) => {
    const boolVal = getBool(kycRequired);
    const dispatch = {
      payload: boolVal,
      type: 'SET_KYC_REQUIRED',
    };
    mintDispatch(dispatch);
  };
  return (
    <div className='flex flex-col  gap-2 py-2 w-full items-start  text-base bg-[#161B22]'>
      <div className='flex items-center gap-2 font-semibold'>
        Does this Contract require KYC?
        <ToolTipNew
          outerStyles={'-top-1 '}
          innerStyles={'w-40 -top-4 whitespace-normal'}
          ToolTipHTML={() => (
            <span>
              Set up a KYC process as a prerequisite for claiming the bounty. We use{' '}
              <a
                className='underline hover:text-link-colour'
                href='https://kycdao.xyz/home'
                target='_blank'
                rel='noreferrer'
              >
                KYC DAO
              </a>{' '}
              to verify our users.
            </span>
          )}
        >
          <div className='cursor-help rounded-full border border-[#c9d1d9] text-sm aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
            ?
          </div>
        </ToolTipNew>
      </div>
      <div className='flex-1 w-full'>
        <div className='flex text-sm rounded-sm text-primary '>
          <SmallToggle toggleVal={reverseBool(kycRequired)} names={['Yes', 'No']} toggleFunc={setKycRequired} />
        </div>
      </div>
    </div>
  );
};

export default KycRequiredToggle;
