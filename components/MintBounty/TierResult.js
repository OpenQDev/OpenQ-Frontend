import React, { useRef } from 'react';

const TierResult = ({ finalTierVolumes, sum }) => {
  const container = useRef();
  return (
    <>
      Total
      <div className={`flex w-11/12 text-sm  w-full items-center gap-2 mb-1`}>
        <div className='w-9 flex-none'>{sum}%</div>
        <div
          ref={container}
          className={`flex border-transparent border-2 flex-none rounded-full overflow-hidden w-full relative ${
            sum < 100 ? 'border-gray-500' : sum > 100 ? 'border-red-500' : 'border-primary'
          }`}
        >
          {finalTierVolumes.map((volume, index) => {
            const saturation = index % 2 ? 84 - index : 84 - index + 1;
            const lightness = !(index % 2) ? 48 + index : 48 + index - 1;
            const hue = 400 - index * 67;
            return (
              <div
                key={index}
                style={{
                  width: `${
                    (container.current && container.current.clientWidth * finalTierVolumes[index] + 50) / 100
                  }px`,
                  backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                }}
                type='textarea'
                className='resize-x h-4 w-full inline z-15 left-0 top-0'
              ></div>
            );
          })}
        </div>
      </div>{' '}
    </>
  );
};
export default TierResult;
