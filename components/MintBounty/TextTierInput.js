import React, { useEffect, useState, useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';

const TextTierInput = ({ tier, tierVolumes, onTierVolumeChange, style }) => {
  // State
  const [suffix, setSuffix] = useState();
  const [appState] = useContext(StoreContext);

  useEffect(() => {
    setSuffix(appState.utils.handleSuffix(tier));
  }, []);

  const handleChange = (value, tierVolumes) => {
    const passedValue = parseInt(value) || 0;
    onTierVolumeChange(
      {
        name: tier,

        target: {
          value: passedValue,
        },
      },
      tierVolumes
    );
  };
  return (
    <div className={`flex-1 w-11/12 mb-1 ${style}`}>
      <input
        name={tier}
        id='tier-volume'
        autoComplete='off'
        placeholder={`${suffix} winner`}
        value={tierVolumes[tier] || ''}
        onChange={(e) => handleChange(e.target.value, tierVolumes)}
        className='input-field w-full ml-2 number'
      />
    </div>
  );
};

export default TextTierInput;
