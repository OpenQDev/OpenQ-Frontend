// Third party
import React from 'react';
import CopyAddressToClipboard from '../../Copy/CopyAddressToClipboard';

const CopyBountyAddress = ({ address, styles }) => {
  return (
    <div className={styles || ''}>
      <div className='flex  items-center space-x-2 cursor-pointer'>
        <CopyAddressToClipboard data={address} />
      </div>
    </div>
  );
};

export default CopyBountyAddress;
