// Third Party

import React from 'react';

const ToolTipNew = ({toolTipText, children, hideToolTip, outerStyles}) => {
	if (hideToolTip) return children;
	return (
		<div className={'group'}>
			{children}
			<div className={`flex justify-center w-full relative hidden z-10 group-hover:block  ${outerStyles} `}>
				<div className="flex flex-col items-center inline-block">
					<div className="flex mt-0.5 md:mt-1 tooltip-triangle absolute"></div>
					<div className="flex tooltip absolute">
						<div>{toolTipText}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ToolTipNew;