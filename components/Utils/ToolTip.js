// Thrid Party

import React, { useState } from 'react';

const ToolTip = (props)=>{
	const {toolTipText, customOffsets, hideToolTip} = props;
	const [x, y] = customOffsets;
	const [isToolTip, setIsTooltip] = useState();
	const showToolTip = (e) =>{
		setIsTooltip([e.pageX, e.pageY]);
	};
	if(hideToolTip)return props.children;
	return (
		<div className='text-white' onMouseMove={showToolTip} onMouseLeave={()=>setIsTooltip(false)}>
			{props.children}	
			{isToolTip&& <div 
				style={{
					position: 'fixed',
					left: (isToolTip[0]-x)>5 ? isToolTip[0]-x : 5,
					top: isToolTip[1]-y}}
				className={`text-white bg-dark-mode  h-min border-web-gray border rounded-md p-2 z-20 ${props.styles}`}>
				{toolTipText}
			</div>}
		</div>
	);
};

export default ToolTip;