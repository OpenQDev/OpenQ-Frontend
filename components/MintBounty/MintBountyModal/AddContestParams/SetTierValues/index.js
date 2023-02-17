import React, { useState, useEffect, useContext } from 'react';
import ToolTipNew from '../../../../Utils/ToolTipNew';
import TierInput from './TierInput';
import TextTierInput from './TextTierInput';
import TierResult from './TierResult';
import SmallToggle from '../../../../Utils/SmallToggle';
import StoreContext from '../../../../../store/Store/StoreContext';
import TokenContext from '../../../../TokenSelection/TokenStore/TokenContext';

const SetTierValues = ({
  category,
  sum,
  setSum,
  tierArr,
  setEnableContest,
  initialVolumes,
  formatVolume,
  finalTierVolumes,
  setFinalTierVolumes,
  currentSum,
}) => {
  const [appState] = useContext(StoreContext);
  const [tokenState] = useContext(TokenContext);
  const { token } = tokenState;
  const newFixedVolumes = [];
  const newVolumesArr = [];
  for (const index in tierArr) {
    if (initialVolumes[index] && formatVolume) {
      console.log('initialVolumes[index]', initialVolumes[index]);
      newFixedVolumes[index] = formatVolume(initialVolumes[index], token);
      newVolumesArr[index] = initialVolumes[index];
    } else {
      console.log('initialVolumes[index] second', initialVolumes[index]);
      newFixedVolumes[parseInt(index) + 1] = 1;
      newVolumesArr[index] = 1;
    }
  }
  const [fixedTierVolumes, setFixedTierVolumes] = useState(newFixedVolumes);
  const [toggleVal, setToggleVal] = useState('Visual');

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
  useEffect(() => {
    if (finalTierVolumes.length) {
      setSum(finalTierVolumes.reduce((a, b) => a + b));
    }

    if (sum == 100 || category === 'Fixed Contest') {
      setEnableContest(true);
    }
  }, [finalTierVolumes]);
  // reset when category changes
  // commented out for now as not currently needed & resets even no actual change of category
  /*   useEffect(() => {
    const newVolumes = [];

    for (const index in tierArr) {
      newVolumes[parseInt(index)] = 1;
    }
    setFinalTierVolumes(newVolumes);
    setFixedTierVolumes(newVolumes);
  }, [category]); */

  const onTierVolumeChange = (e) => {
    if (
      parseInt(e.target.value) >= 0 ||
      parseInt(e.target.value) === '' ||
      !Number(e.target.value) ||
      parseInt(e.target.value) > 100
    ) {
      const newVolumes = [...finalTierVolumes];
      newVolumes[e.name] = parseInt(e.target.value);
      setFinalTierVolumes(newVolumes);
    }
  };

  const handleToggle = () => {
    if (toggleVal === 'Visual') {
      const newVolumes = {};
      const newVolumesArr = [];
      for (const index in tierArr) {
        newVolumes[parseInt(index) + 1] = 1;
        newVolumesArr[index] = 1;
      }
      setToggleVal('Text');
      setSum(0);
      setFinalTierVolumes(newVolumesArr);
    } else {
      const newVolumesArr = [];
      for (const index in tierArr) {
        newVolumesArr[index] = 1;
      }
      setFinalTierVolumes(newVolumesArr);
      setToggleVal('Visual');
    }
  };
  return (
    <>
      {category === 'Contest' ? (
        <div className='py-2 gap-2  flex flex-col w-full  text-base'>
          <div className='flex  gap-2 font-semibold'>
            Weight per Tier (%)
            <ToolTipNew
              innerStyles={'w-40 whitespace-normal'}
              toolTipText={'How much % of the total will each winner earn?'}
            >
              <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 text-sm box-content text-center font-bold text-primary'>
                ?
              </div>
            </ToolTipNew>
          </div>
          <SmallToggle toggleVal={toggleVal} className={'  '} toggleFunc={handleToggle} names={['Visual', 'Text']} />
          {sum !== currentSum ? (
            <span className='text-sm'>You must give a value for each tier</span>
          ) : sum > 100 ? (
            <span className='text-sm  text-[#f85149]'>The sum can not be more than 100%!</span>
          ) : sum === 100 ? (
            <span className='text-sm '>Sum is 100, now you can mint.</span>
          ) : (
            <span className='text-sm'>
              For the sum to add up to 100, you still need to allocate: {100 - currentSum} %
            </span>
          )}
          {toggleVal === 'Visual' ? (
            <div className=' w-full mx-h-60 pl-4 overflow-y-auto overflow-x-hidden'>
              {tierArr.map((t) => {
                return (
                  <div key={t}>
                    <TierInput tier={t} tierVolumes={finalTierVolumes} onTierVolumeChange={onTierVolumeChange} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='max-h-40 w-full overflow-y-auto overflow-x-hidden'>
              {tierArr.map((t, i) => {
                return (
                  <div key={i}>
                    <TextTierInput
                      tier={i + 1}
                      tierVolumes={finalTierVolumes}
                      onTierVolumeChange={onTierVolumeChange}
                      decimal={false}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <TierResult sum={currentSum} finalTierVolumes={finalTierVolumes} />
        </div>
      ) : (
        <div className='max-h-40 w-full flex flex-col gap-2 overflow-y-auto overflow-x-hidden'>
          {tierArr.map((t, i) => {
            return (
              <div key={i} className='flex gap-2 mr-10'>
                <div className='w-10'>{appState.utils.handleSuffix(i + 1)}</div>
                <TextTierInput
                  tier={i + 1}
                  tierVolumes={fixedTierVolumes}
                  onTierVolumeChange={onFixedTierChange}
                  decimal={true}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
export default SetTierValues;
