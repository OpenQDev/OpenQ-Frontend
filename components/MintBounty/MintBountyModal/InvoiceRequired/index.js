import React, { useContext } from 'react';
import SmallToggle from '../../../Utils/SmallToggle';
import ToolTipNew from '../../../Utils/ToolTipNew';
import MintContext from '../../MintContext';
import { getBool, reverseBool } from '../../../../services/utils/lib';

const InvoiceableToggle = () => {
  const [mintState, mintDispatch] = useContext(MintContext);
  const { invoiceable } = mintState;
  const setInvoiceable = (invoiceable) => {
    const boolVal = getBool(invoiceable);
    const dispatch = {
      payload: boolVal,
      type: 'SET_INVOICEABLE',
    };
    mintDispatch(dispatch);
  };
  return (
    <div className='flex flex-col  gap-2 py-2 w-full items-start  text-base bg-[#161B22]'>
      <div className='flex items-center gap-2 font-semibold'>
        Is this Contract invoiceable?
        <ToolTipNew
          outerStyles={'-top-1 '}
          innerStyles={'w-40 whitespace-normal'}
          toolTipText={'Set invoicing as a requirement for claiming the bounty.'}
        >
          <div className='cursor-help rounded-full border border-[#c9d1d9] text-sm aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
            ?
          </div>
        </ToolTipNew>
      </div>
      <div className='flex-1 w-full'>
        <div className='flex text-sm rounded-sm text-primary '>
          <SmallToggle toggleVal={reverseBool(invoiceable)} names={['Yes', 'No']} toggleFunc={setInvoiceable} />
        </div>
        <span className='note'>Note: crowdfunding is not available on contracts for which invoicing is required.</span>
      </div>
    </div>
  );
};

export default InvoiceableToggle;
