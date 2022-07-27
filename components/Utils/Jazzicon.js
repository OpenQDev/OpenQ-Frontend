
import React, { useRef, useEffect } from 'react';
import jazzicon from '@metamask/jazzicon';
import ToolTip from './ToolTip';

const Jazzicon = ({address, size, styles})=>{
	const iconWrapper = useRef();
	useEffect(async () => {
		if (address && iconWrapper.current) {
			iconWrapper.current.innerHTML = '';
			iconWrapper.current.appendChild(
				jazzicon(size, parseInt(address.slice(2, 10), 16))
			);
		}
	}, [address]);
	return (
	
		<ToolTip toolTipText={address} styles={styles} customOffsets={[ 38,-6]}>
			<div  ref={iconWrapper}>
				{address}</div>
		</ToolTip>);
};
export default Jazzicon;