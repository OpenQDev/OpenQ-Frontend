import React from 'react';

const WinnerSelect = ({ prize, numberOfPayouts }) => {
  const height = (100 / numberOfPayouts) * (numberOfPayouts - prize.index);
  const tierIndex = parseInt(prize.index);
  const saturation = tierIndex % 2 ? 84 - tierIndex : 84 - tierIndex + 1;
  const lightness = !(tierIndex % 2) ? 48 + tierIndex : 48 + tierIndex - 1;
  const hue = 400 - tierIndex * 67;
  const selectWinner = () => {
    console.log(`selecting ${prize.index + 1}`);
  };
  return (
    <div
      onClick={selectWinner}
      className='flex justify-center cursor-pointer text-black content-center items-center w-full'
      style={{
        height: `${height}px`,
        transform: `translateY(${100 - height}px)`,
        transformOrigin: 'left center',
        backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      }}
    >
      <div> {prize.index + 1}</div>
    </div>
  );
};
export default WinnerSelect;
