import React from 'react';

const ToolTipNew = ({
  toolTipText,
  children,
  groupStyles,
  hideToolTip,
  outerStyles,
  innerStyles,
  relativePosition,
}) => {
  if (hideToolTip) return children;
  return (
    <div className={`group ${groupStyles}`}>
      {children}
      <div className={`justify-center w-full relative hidden z-50 group-hover:block  ${outerStyles} `}>
        <div className='flex flex-col items-center'>
          <div className='flex mt-0.5 md:mt-1 tooltip-triangle absolute'></div>
          <div className={`flex tooltip absolute ${relativePosition}`}>
            <div className={`${innerStyles}`}>{toolTipText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolTipNew;
