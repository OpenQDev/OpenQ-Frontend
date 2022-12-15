import React, { useRef, useEffect } from 'react';
import jazzicon from '@metamask/jazzicon';
import ToolTipNew from './ToolTipNew';

const Jazzicon = ({ address, size, tooltipPosition, name }) => {
  const iconWrapper = useRef();
  useEffect(() => {
    if (address && iconWrapper.current) {
      iconWrapper.current.innerHTML = '';
      iconWrapper.current.appendChild(jazzicon(size, parseInt(address.slice(2, 10), 16)));
    }
  }, [address]);
  return (
    <div data-testid='link' className={!address && 'w-9 h-9 mr-px'}>
      <ToolTipNew toolTipText={name || address} outerStyles={'relative bottom-2'} relativePosition={tooltipPosition}>
        <div className='cursor-pointer' ref={iconWrapper}>
          {address}
        </div>
      </ToolTipNew>
    </div>
  );
};
export default Jazzicon;
