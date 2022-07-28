// Third Party
import React, { useRef, useEffect} from 'react';
import jazzicon from '@metamask/jazzicon';
//Custom
import CopyAddressToClipboard from '../../Copy/CopyAddressToClipboard';


const AboutTitle = ({ensName, account}) =>{
	const iconWrapper = useRef(null);

	useEffect(async () => {
		if (account && iconWrapper.current) {
			iconWrapper.current.innerHTML = '';
			iconWrapper.current.appendChild(jazzicon(32, parseInt(account.slice(2, 10), 16)));
		}
	}, [account]);
	
	return (<h1 className='flex items-center font-semibold p-8 pl-16 flex gap-4'>
		<span className='flex' ref={iconWrapper}></span>
		<span className='flex leading-none'>
			<span className='flex'>{ensName}</span>
			<CopyAddressToClipboard data={account} clipping={[5, 38]} />
		</span>
	</h1>);
};

export default AboutTitle;                                                                                                                                                                                                                                                                                