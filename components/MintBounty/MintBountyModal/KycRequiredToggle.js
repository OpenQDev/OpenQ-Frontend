import React, { useContext } from 'react';
import ToolTipNew from '../../Utils/ToolTipNew';
import MintContext from '../MintContext';

const KycRequiredToggle = () => {
  const [mintState, mintDispatch] = useContext(MintContext);
  const { kycRequired, category } = mintState;
  const setKycRequired = (kycRequired) => {
    const dispatch = {
      payload: kycRequired,
      type: 'SET_KYC_REQUIRED',
    };
    mintDispatch(dispatch);
  };
  const isCrowdFundable = category === 'Fixed Price' || kycRequired === false;
  return (
    <div className='flex flex-col  gap-2 py-2 w-full items-start  text-base bg-[#161B22]'>
      <div className='flex items-center gap-2 font-semibold'>
        Does this Contract require KYC?
        <ToolTipNew innerStyles={'w-40 whitespace-normal'} toolTipText={'Does this contract require KYC?'}>
          <div className='cursor-help rounded-full border border-[#c9d1d9] text-sm aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
            ?
          </div>
        </ToolTipNew>
      </div>
      <div className='flex-1 w-full'>
        <div className='flex text-sm rounded-sm text-primary '>
          <ToolTipNew
            innerStyles={'flex'}
            hideToolTip={true}
            relativePosition={'-left-2'}
            outerStyles={'relative bottom-1'}
            toolTipText={'Invoicing feature coming soon'}
          >
            <button
              onClick={() => setKycRequired(true)}
              className={` w-fit min-w-[80px] py-[5px] px-4 rounded-l-sm border whitespace-nowrap ${
                kycRequired ? 'bg-secondary-button border-secondary-button' : ''
              }  border-web-gray`}
            >
              Yes
            </button>
          </ToolTipNew>
          <button
            onClick={() => setKycRequired(false)}
            className={`w-fit min-w-[80px] py-[5px] px-4 border-l-0 rounded-r-sm border whitespace-nowrap ${
              !kycRequired
                ? 'bg-secondary-button border-secondary-button'
                : 'hover:bg-secondary-button hover:border-secondary-button border-web-gray'
            } `}
          >
            No
          </button>
        </div>
        <span className='note'>
          {' '}
          {!isCrowdFundable &&
            `Note: crowdfunding is not available on ${category.toLowerCase()} contracts for which KYC is required.`}
        </span>
      </div>
    </div>
  );
};

export default KycRequiredToggle;
