import React, { useState } from 'react';
import CreateStream from '../../components/Stream/CreateStream';
import ViewStream from '../../components/Stream/ViewStream';
import BountyMenu from '../../components/Bounty/BountyMenu';



const stream = () => {
	const [internalMenu, setInternalMenu] = useState('Stream');
	const handleToggle = (e) => {
		setInternalMenu(e);
	};

	return (
		<div className="flex flex-col font-mont justify-center items-center pt-7">
			<BountyMenu styles="justify-center" items={[{name: 'Stream' },{name: 'View Stream' } ]} internalMenu={internalMenu} updatePage={handleToggle}/>
				
			<div className="text-center bg-[#161B22] py-14 w-full">
				<div className="text-2xl font-bold">Streaming</div>
				<div className="text-gray-500 text-md">{internalMenu === 'Stream' ? 'Stream Payments' : 'View Streams'}</div>
			</div>	
			{internalMenu == 'Stream' ? <CreateStream /> : null}
			{internalMenu == 'View Stream' ? <ViewStream /> : null}
		</div>
	);
};

export default stream;