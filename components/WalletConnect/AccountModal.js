// Thrid Party
import React, { useState } from 'react';

const AccountModal = ({ toolTipText, setIsTooltip }) => {

	const [isToolTip, setIsTooltip] = useState();

	const showToolTip = (e) => {
		setIsTooltip([e.target.offsetLeft, e.target.offsetTop]);
	};

	return (
		<div>
			<div className='cursor-help rounded-full border-2 border-web-gray aspect-square leading-6 h-6 box-content text-center font-bold text-web-gray'>?</div>
			{isToolTip && <div
				style={{
					position: 'fixed',
					left: (isToolTip[0] - 370) > 5 ? isToolTip[0] - 370 : 5,
					top: isToolTip[1] - 100
				}}
				className='text-white bg-dark-mode w-96 h-min border-web-gray border rounded-md p-2'>
				{toolTipText}
			</div>}
		</div>
	);
};

export default AccountModal;