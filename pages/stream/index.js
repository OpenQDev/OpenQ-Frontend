import React, { useState, useContext, useEffect } from 'react';
import Toggle from '../../components/Utils/Toggle';
import CreateStream from './CreateStream';
import ViewStream from './ViewStream';


const stream = () => {
	const [internalMenu, setInternalMenu] = useState('View');

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