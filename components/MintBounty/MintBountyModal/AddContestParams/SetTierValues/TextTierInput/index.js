import React, { useEffect, useState, useContext } from 'react';
import StoreContext from '../../../../../../store/Store/StoreContext';

const TextTierInput = ({ tier, tierVolumes, onTierVolumeChange, style, decimal, adminPage, initialVolumes }) => {
  const [localValue, setLocalValue] = useState(tierVolumes[tier - 1] || 1);
  // State
  const [suffix, setSuffix] = useState();
  const [appState] = useContext(StoreContext);

  useEffect(() => {
    setSuffix(appState.utils.handleSuffix(tier));
  }, []);

  useEffect(() => {
    if (adminPage) setLocalValue(initialVolumes[tier - 1]);
  }, [initialVolumes]);

  const handleChange = (value, tierVolumes) => {
    const formattedValue = appState.utils.contestNumberFormat(value, decimal);
    setLocalValue(formattedValue);
    if (formattedValue) {
      const passedValue = formattedValue;
      onTierVolumeChange(
        {
          name: tier - 1,

          target: {
            value: passedValue,
          },
        },
        tierVolumes
      );
    } else {
      onTierVolumeChange(
        {
          name: tier - 1,

          target: {
            value: 0,
          },
        },
        tierVolumes
      );
    }
  };
  return (
    <div className={`flex-1 w-11/12 mb-1 ${style}`}>
      <input
        name={tier}
        id='tier-volume'
        autoComplete='off'
        placeholder={`${suffix} winner`}
        value={localValue || ''}
        onChange={(e) => handleChange(e.target.value, tierVolumes)}
        className='input-field w-full number'
      />
    </div>
  );
};

export default TextTierInput;
