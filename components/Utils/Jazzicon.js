import React, { useRef, useEffect } from 'react';
import jazzicon from '@metamask/jazzicon';
import ToolTipNew from './ToolTipNew';
import Link from 'next/link';

const Jazzicon = ({ address, size, tooltipPosition }) => {
  const iconWrapper = useRef();
  useEffect(async () => {
    if (address && iconWrapper.current) {
      iconWrapper.current.innerHTML = '';
      iconWrapper.current.appendChild(jazzicon(size, parseInt(address.slice(2, 10), 16)));
    }
  }, [address]);
  return (
    <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/user/${address}`}>
      <a className={`cursor-pointer ${!address && 'w-9 mr-px'}`}>
        <ToolTipNew toolTipText={address} outerStyles={'relative bottom-2'} relativePosition={tooltipPosition}>
          <div ref={iconWrapper}>{address}</div>
        </ToolTipNew>
      </a>
    </Link>
  );
};
export default Jazzicon;
