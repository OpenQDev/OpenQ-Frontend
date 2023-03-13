import React from 'react';
import ToolTipNew from '../ToolTipNew';

const InfoInToolTip = ({ toolTipText }) => {
  return (
    <div className='w-4 '>
      <ToolTipNew mobileX={10} toolTipText={toolTipText}>
        <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary text-sm'>
          ?
        </div>
      </ToolTipNew>
    </div>
  );
};
export default InfoInToolTip;
