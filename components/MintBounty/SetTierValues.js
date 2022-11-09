import React, { useState, useEffect } from 'react';
import ToolTipNew from '../Utils/ToolTipNew';
import TierInput from './TierInput';
import TextTierInput from './TextTierInput';
import TierResult from './TierResult';
import SmallToggle from '../Utils/SmallToggle';

const SetTierValues = ({
  category,
  sum,
  setSum,
  tierArr,
  setEnableContest,
  finalTierVolumes,
  setFinalTierVolumes,
  initialVolumes,
}) => {
  const newFixedVolumes = {};
  const newVolumesArr = [];
  for (const index in tierArr) {
    newFixedVolumes[parseInt(index) + 1] = 1;
    newVolumesArr[index] = 1;
  }
  const initialNumberVolumes = initialVolumes.map((elem) => parseInt(elem));
  const [tierVolumes, setTierVolumes] = useState(initialNumberVolumes);
  const [fixedTierVolumes, setFixedTierVolumes] = useState(newFixedVolumes);
  const [toggleVal, setToggleVal] = useState('Visual');

  useEffect(() => {
    const newFixedVolumes = {};
    for (const index in tierArr) {
      newFixedVolumes[parseInt(index) + 1] = 1;
    }
    setFixedTierVolumes(newFixedVolumes);
  }, [tierArr]);
  function onFixedTierChange(e, localTierVolumes) {
    if (
      parseInt(e.target.value) >= 0 ||
      parseInt(e.target.value) === '' ||
      !Number(e.target.value) ||
      parseInt(e.target.value) > 100
    ) {
      setFixedTierVolumes({
        ...localTierVolumes,
        [e.name]: parseInt(e.target.value),
      });
    }
  }
  useEffect(() => {
    if (category === 'Contest') {
      setFinalTierVolumes(Object.values(tierVolumes));
    } else {
      setFinalTierVolumes(Object.values(fixedTierVolumes));
    }
  }, [tierVolumes, fixedTierVolumes]);
  useEffect(() => {
    if (finalTierVolumes.length) {
      setSum(finalTierVolumes.reduce((a, b) => a + b));
    }

    if (sum == 100 || category === 'Fixed Contest') {
      setEnableContest(true);
    }
  }, [finalTierVolumes]);

  const onTierVolumeChange = (e, localTierVolumes) => {
    if (
      parseInt(e.target.value) >= 0 ||
      parseInt(e.target.value) === '' ||
      !Number(e.target.value) ||
      parseInt(e.target.value) > 100
    ) {
      setTierVolumes({
        ...localTierVolumes,
        [e.name]: parseInt(e.target.value),
      });
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
      setTierVolumes(newVolumes);
      setFinalTierVolumes(newVolumesArr);
    } else {
      const newVolumes = {};
      const newVolumesArr = [];
      for (const index in tierArr) {
        newVolumes[parseInt(index)] = 1;
        newVolumesArr[index] = 1;
      }
      setToggleVal('Visual');
      setTierVolumes(newVolumes);
    }
  };
  return (
    <>
      {category === 'Contest' ? (
        <div className='py-2 gap-2  flex flex-col w-full  text-base'>
          <div className='flex  gap-2'>
            Weight per Tier (%)
            <ToolTipNew mobileX={10} toolTipText={'How much % of the total will each winner earn?'}>
              <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 text-sm box-content text-center font-bold text-primary'>
                ?
              </div>
            </ToolTipNew>
          </div>
          <SmallToggle
            toggleVal={toggleVal}
            className={' ml-2 '}
            toggleFunc={handleToggle}
            names={['Visual', 'Text']}
          />
          {sum > 100 ? (
            <span className='text-sm  text-[#f85149]'>The sum can not be more than 100%!</span>
          ) : sum === 100 ? (
            <span className='text-sm '>Sum is 100, now you can mint.</span>
          ) : (
            <span className='text-sm'>For the sum to add up to 100, you still need to allocate: {100 - sum} %</span>
          )}
          {toggleVal === 'Visual' ? (
            <div className=' w-full mx-h-60 pl-4 overflow-y-auto overflow-x-hidden'>
              {tierArr.map((t) => {
                return (
                  <div key={t}>
                    <TierInput tier={t} tierVolumes={tierVolumes} onTierVolumeChange={onTierVolumeChange} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='max-h-40 w-full overflow-y-auto overflow-x-hidden'>
              {tierArr.map((t, i) => {
                return (
                  <div key={i}>
                    <TextTierInput tier={i + 1} tierVolumes={tierVolumes} onTierVolumeChange={onTierVolumeChange} />
                  </div>
                );
              })}
            </div>
          )}
          <TierResult sum={sum} finalTierVolumes={finalTierVolumes} />
        </div>
      ) : (
        <div className='max-h-40 w-full flex flex-col gap-2 overflow-y-auto overflow-x-hidden'>
          {tierArr.map((t, i) => {
            return (
              <div key={i}>
                <TextTierInput tier={i + 1} tierVolumes={fixedTierVolumes} onTierVolumeChange={onFixedTierChange} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
export default SetTierValues;
