
import React, { useRef, useEffect } from 'react';
import jazzicon from '@metamask/jazzicon';
import ToolTip from './ToolTip';
import Link from 'next/link';

const Jazzicon = ({ address, size, styles }) => {
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
		<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/user/${address}`}>
			<div ref={iconWrapper} className="cursor-pointer">
				<ToolTip toolTipText={address} styles={styles} customOffsets={[38, -6]}>
					{address}
				</ToolTip>
			</div>
		</Link>);
};
export default Jazzicon;