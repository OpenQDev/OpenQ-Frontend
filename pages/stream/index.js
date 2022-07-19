import React, { useState } from 'react';
import Toggle from '../../components/Utils/Toggle';
import CreateStream from '../../components/Stream/CreateStream';
import ViewStream from '../../components/Stream/ViewStream';


const stream = () => {
	const [internalMenu, setInternalMenu] = useState('Stream');

	const handleToggle = (e) => {
		setInternalMenu(e);
	};

	return (
		<div className="flex flex-col font-mont justify-center items-center pt-7">
			<Toggle
				toggleFunc={handleToggle}
				toggleVal={internalMenu}
				names={['View', 'Stream']}
			/>
			{internalMenu == 'View' ? <ViewStream /> : null}
			{internalMenu == 'Stream' ? <CreateStream /> : null}
		</div>
	);
};

export default stream;