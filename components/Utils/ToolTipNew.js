// Thrid Party

import React, { useState } from 'react';

const ToolTip = (props)=>{
	const {toolTipText, customOffsets, styles, mobileX } = props;
	const [x, updateX]= useState(customOffsets[0]);
	const [, y] = customOffsets;
	const setToolTip = () =>{
		if(window.innerWidth<750 && mobileX) updateX(mobileX);
		else updateX(customOffsets[0]);
	};
	if(props.hideToolTip) return props.children;
	return (
		<div className={`relative group rounded-full ${props.outerStyles}`} onMouseEnter={setToolTip}>
			{props.children}
			<div style={{left: x, top: y}} className={`flex justify-center absolute hidden z-10 group-hover:block  ${mobileX === x ? 'w-72' : styles} `}>
				<div className='tooltip'>
					<div >{toolTipText}</div>
				</div>
			</div>
		</div>
	);
};

export default ToolTip;