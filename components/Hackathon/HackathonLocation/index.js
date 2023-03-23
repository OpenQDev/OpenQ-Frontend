import React, { useContext } from 'react';
import { PeopleIcon, DeviceDesktopIcon } from '@primer/octicons-react';
import HackathonContext from '../HackathonStore/HackathonContext';
import { handleDispatch } from '../../../services/utils/lib';

const HackathonLocation = () => {
  const [hackathonState, hackathonDispatch] = useContext(HackathonContext);
  const { isIrl, city } = hackathonState;
  const handleRadio = (e) => {
    const isIrl = e.target.id === 'isIrl';
    const dispatch = {
      type: 'SET_IS_IRL',
      payload: isIrl,
    };
    hackathonDispatch(dispatch);
  };
  return (
    <div className='border-t border-web-gray'>
      <div className='my-8'>
        <div className='flex gap-3 content-center items-start'>
          <input checked={isIrl} onChange={handleRadio} type='radio' className='h-6' id='isIrl' name='isIrl' />
          <PeopleIcon className='h-6' size={16} />

          <label htmlFor='isIrl'>
            <h4 className='font-semibold'>IRL</h4>
            <span className='note'>The hackathon will be an in-person event</span>
          </label>
        </div>
        <div className='my-4'>
          <label htmlFor='city' className='font-semibold text-lg block w-60 '>
            Enter city
          </label>

          <input
            disabled={!isIrl}
            onChange={(e) => handleDispatch(e, 'SET_CITY', hackathonDispatch)}
            className={`input-field w-full max-w-60 h-8  ${!isIrl && 'cursor-not-allowed'}`}
            value={city !== 'virtual' ? city : ''}
            id={'city'}
          />
        </div>

        <div className='flex gap-3 content-center items-start'>
          <input checked={!isIrl} onChange={handleRadio} className='h-6' type='radio' name='isIrl' id='isVirtual' />
          <DeviceDesktopIcon className='h-6' size={16} />

          <label htmlFor='isVirtual'>
            <h4 className='font-semibold'>Virtual</h4>
            <span className='note'>The hackathon will be an virtual event.</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default HackathonLocation;
