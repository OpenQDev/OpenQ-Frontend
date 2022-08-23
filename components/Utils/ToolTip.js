// Thrid Party

import React, { useState } from 'react';

const ToolTip = ({toolTipText, customOffsets, styles, mobileX, hideToolTip, children, outerStyles, link })=>{
	const [x, updateX]= useState(customOffsets[0]);
	const [, y] = customOffsets;
	const setToolTip = () =>{
		if(window.innerWidth<750 && mobileX) updateX(mobileX);
		else updateX(customOffsets[0]);
	};
	if(hideToolTip) return children;
	return (
		<div className={`relative group rounded-full h-min ${outerStyles}`} onMouseEnter={setToolTip}>
			{children}
			<div style={{left: x, top: y}} className={`flex justify-center absolute hidden z-10 group-hover:block justify-items-center w-full h-3 pt-0.5 ${mobileX === x ? 'w-72' : styles} min-w-[200px]`}>
				<div className=' bg-dark-mode h-min border-web-gray border rounded-sm p-2 z-20'>
					<div >{toolTipText}</div>
					{link &&	<a className='underline' href={link}>{link}</a>}
				</div>
			</div>
		</div>
	);
};

export default ToolTip;