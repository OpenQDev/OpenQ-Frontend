import React, { useState, useEffect, useContext } from 'react';
import TextTierInput from './TextTierInput';
import StoreContext from '../../../../../store/Store/StoreContext';

const SetTierValues = ({ tierArr, initialVolumes, finalTierVolumes, setFinalTierVolumes, adminPage }) => {
  const [appState] = useContext(StoreContext);
  const newFixedVolumes = [];
  const [fixedTierVolumes, setFixedTierVolumes] = useState([]);
  useEffect(() => {
    for (const index in tierArr) {
      if (initialVolumes[index]) {
        newFixedVolumes[index] = initialVolumes[index];
      } else {
        newFixedVolumes[parseInt(index) + 1] = 1;
      }
    }
    if (adminPage) setFinalTierVolumes(newFixedVolumes);
    setFixedTierVolumes(newFixedVolumes);
  }, [initialVolumes]);

  useEffect(() => {
    const newFixedVolumes = [];
    for (const index in tierArr) {
      newFixedVolumes[parseInt(index)] = finalTierVolumes[parseInt(index)] || 1;
    }
    setFixedTierVolumes(newFixedVolumes);
    const newFinalVolumes = finalTierVolumes.slice(0, tierArr.length);
    while (newFinalVolumes.length < tierArr.length) {
      newFinalVolumes.push(1);
    }
    setFinalTierVolumes(newFinalVolumes);
  }, [tierArr]);

  function onFixedTierChange(e) {
    const newVolumes = [...finalTierVolumes];
    newVolumes[e.name] = parseFloat(e.target.value);
    setFixedTierVolumes(newVolumes);
    setFinalTierVolumes(newVolumes);
  }

  return (
    <div className='max-h-40 w-full flex flex-col gap-2 overflow-y-auto overflow-x-hidden'>
      {tierArr.map((t, i) => {
        return (
          <div key={i} className='flex gap-2 mr-10'>
            <div className='w-10'>{appState.utils.handleSuffix(i + 1)}</div>
            <TextTierInput
              tier={i + 1}
              tierVolumes={fixedTierVolumes}
              initialVolumes={initialVolumes}
              onTierVolumeChange={onFixedTierChange}
              decimal={true}
              adminPage={adminPage}
            />
          </div>
        );
      })}
    </div>
  );
};
export default SetTierValues;
