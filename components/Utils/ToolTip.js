// Thrid Party

import React, { useState } from 'react';

const ToolTip = (props)=>{
	const {toolTipText, customOffsets, styles, mobileX } = props;
	const hideToolTip=false;
	const [x, updateX]= useState(customOffsets[0]);
	const [, y] = customOffsets;
	const [isToolTip, setIsTooltip] = useState(false);
	const showToolTip = () =>{
		setIsTooltip(true);
		console.log(window.innerWidth);
		if(window.innerWidth<750 && mobileX) updateX(mobileX);
		else updateX(customOffsets[0]);
	};
	if(hideToolTip)return props.children;
	return (
		<div className={`relative ${props.outerStyles}`} onMouseEnter={showToolTip} onMouseLeave={()=>setIsTooltip(false)}>
			{props.children}
			{isToolTip&& 
			<div style={{left: x, top: y}} className={`flex justify-center absolute justify-items-center w-full h-3 pt-0.5 ${mobileX === x ? 'w-72' : styles}`}>
				<div className='text-white bg-dark-mode  h-min border-web-gray border rounded-md p-2 z-20 w-96'>
					{toolTipText}
				</div>
			</div>}
		</div>
	);
};

export default ToolTip;