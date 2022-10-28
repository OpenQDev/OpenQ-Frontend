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
  const initialNumberVolumes = initialVolumes.map((elem) => parseInt(elem));
  const [tierVolumes, setTierVolumes] = useState(initialNumberVolumes);
  const [fixedTierVolumes, setFixedTierVolumes] = useState({});
  const [toggleVal, setToggleVal] = useState('Visual');
  function onFixedTierChange(e, localTierVolumes) {
    if (parseInt(e.target.value) >= 0) {
      setFixedTierVolumes({
        ...localTierVolumes,
        [e.name]: parseInt(e.target.value),
      });
    }
    if (parseInt(e.target.value) === '' || !Number(e.target.value) || parseInt(e.target.value) > 100) {
      setFixedTierVolumes({
        ...localTierVolumes,
        [e.name]: parseInt(e.target.value),
      });
    }
  }
  useEffect(() => {
    setFinalTierVolumes(Object.values(tierVolumes));
  }, [tierVolumes]);
  useEffect(() => {
    if (finalTierVolumes.length) {
      setSum(finalTierVolumes.reduce((a, b) => a + b));
    }

    if (sum == 100 || category === 'Fixed Contest') {
      setEnableContest(true);
    }
  }, [finalTierVolumes]);

  const onTierVolumeChange = (e, localTierVolumes) => {
    if (parseInt(e.target.value) >= 0) {
      setTierVolumes({
        ...localTierVolumes,
        [e.name]: parseInt(e.target.value),
      });
    }
    if (parseInt(e.target.value) === '' || !Number(e.target.value) || parseInt(e.target.value) > 100) {
      setTierVolumes({
        ...localTierVolumes,
        [e.name]: parseInt(e.target.value),
      });
    }
  };
  const handleToggle = () => {
    if (toggleVal === 'Visual') {
      setToggleVal('Text');
      setTierVolumes({});
      setSum(0);
      setFinalTierVolumes([]);
    } else {
      setToggleVal('Visual');
      setTierVolumes({ 0: 1, 1: 1, 2: 1 });
    }
  };
  return (
    <>
      {category === 'Contest' ? (
        <div className='flex flex-col gap-2 w-full items-start p-2 py-1 pb-0 text-base'>
          <div className='flex items-center gap-2'>
            Weight per Tier (%)
            <ToolTipNew mobileX={10} toolTipText={'How much % of the total will each winner earn?'}>
              <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 text-sm box-content text-center font-bold text-primary'>
                ?
              </div>
            </ToolTipNew>
          </div>
          <SmallToggle
            toggleVal={toggleVal}
            className={' ml-4 '}
            toggleFunc={handleToggle}
            names={['Visual', 'Text']}
          />
          {sum >= 100 ? (
            <span className='text-sm '>Sum is 100, now you can mint.</span>
          ) : (
            <span className='text-sm'>For the sum to add up to 100, you still need to allocate: {100 - sum} %</span>
          )}
          {toggleVal === 'Visual' ? (
            <div className=' w-full mx-h-60 overflow-y-auto overflow-x-hidden'>
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
        <div className='max-h-40 w-full overflow-y-auto overflow-x-hidden'>
          {tierArr.map((t) => {
            return (
              <div key={t}>
                <TextTierInput tier={t} tierVolumes={fixedTierVolumes} onTierVolumeChange={onFixedTierChange} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
export default SetTierValues;
