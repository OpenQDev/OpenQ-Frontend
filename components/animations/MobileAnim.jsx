import React from 'react';

const MobileAnim = () => {
  return (
    <object
      className='object-contain w-full max-w-xl pt-4'
      data='/mobile-anim.svg'
      style={{
        width: '100%',
        'min-height': '400px',
        height: 'auto', // set the width
        // set the height
      }}
    />
  );
};

export default MobileAnim;
