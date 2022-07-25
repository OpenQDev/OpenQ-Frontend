// Third Party

import React, { useState } from 'react';

const ToolTip = (props) => {
	const { toolTipText} = props;
	if (props.hideToolTip) return props.children;
	return (
		<div className={`group`}>
			{props.children}
			<div className={`flex justify-center w-full relative hidden z-10 group-hover:block  ${props.outerStyles} `}>
				<div class="flex flex-col items-center inline-block">
					<div class="flex mt-1 tooltip-triangle absolute"></div>
					<div class="flex tooltip absolute">
						<div>{toolTipText}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ToolTip;