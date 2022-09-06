import React, { useEffect, useState, useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';

const TierInput = ({ tier, tierVolume, onTierVolumeChange, style }) => {
  // State
  const [suffix, setSuffix] = useState();
  const [appState] = useContext(StoreContext);

  useEffect(() => {
    setSuffix(appState.utils.handleSuffix(tier));
  }, []);

  return (
    <div className={`flex-1 w-11/12 mb-1  ml-4 ${style}`}>
      <input
        name={tier}
        id='tier-volume'
        autoComplete='off'
        placeholder={`${suffix} winner`}
        value={tierVolume || ''}
        onChange={onTierVolumeChange}
        className='input-field w-full number'
      />
    </div>
  );
};

export default TierInput;
