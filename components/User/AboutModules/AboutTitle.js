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
	
	return (<h1 className='font-semibold p-4 text-2xl flex gap-2'>
		<span className='pt-2' ref={iconWrapper}></span>
		<span className='leading-none'>
			<span>{ensName}</span>
			<CopyAddressToClipboard data={account} noClip={ensName < 15} clipping={[5, 39]} />
		</span>
	</h1>);
};

export default AboutTitle;                                                                                                                                                                                                                                                                                