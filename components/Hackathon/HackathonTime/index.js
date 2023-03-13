import React, { useContext, useEffect, useRef, useState } from 'react';
import InfoInToolTip from '../../../components/Utils/InfoInToolTip';
import SmallToggle from '../../../components/Utils/SmallToggle';
import ToolTipNew from '../../../components/Utils/ToolTipNew.js';
import HackathonContext from '../HackathonStore/HackathonContext';

import TimezoneSelect from 'react-timezone-select';
import { CalendarIcon } from '@primer/octicons-react';

const HackathonTime = () => {
  const [selectedTimezone, setSelectedTimezone] = useState('Europe/Greenwich');
  const [hackathonState, hackathonDispatch] = useContext(HackathonContext);
  const { endDate, startDate } = hackathonState;
  const classNames = 'text-black';
  const inputRef = useRef();
  useEffect(() => {}, [inputRef.current]);
  const handleStartDate = (e) => {
    // if (!e.target.value) return;
    const dispatch = {
      type: 'SET_START_DATE',
      payload: e.target.value,
    };
    hackathonDispatch(dispatch);
  };
  const handleEndDate = (e) => {
    if (!e.target.value) return;
    const dispatch = {
      type: 'SET_END_DATE',
      payload: e.target.value,
    };
    hackathonDispatch(dispatch);
  };
  return (
    <>
      <div className='my-2'>
        <label className='font-semibold text-lg  block my-2 ' htmlFor={'proAccount'}>
          Timezone
        </label>
        <TimezoneSelect
          //provid classnames based on state for each inner component
          className={classNames}
          value={selectedTimezone}
          onChange={setSelectedTimezone}
        />
      </div>
      <div className='my-2'>
        <label
          className='font-semibold text-lg my-2 max-w-xs flex content-center gap-2 items-center'
          htmlFor={'proAccount'}
        >
          Hackathon Period
          <InfoInToolTip toolTipText={'Choose the start and end dates for your hackathon'} />
        </label>
        <div className='input-field w-full h-8 max-w-60 block my-2' id={'proAccount'}>
          <div className='relative flex'>
            <div className='absolute pointer-events-none left-0 top-1 bottom-1'>{startDate}</div>
            <CalendarIcon className='absolute right-0 top-1 bottom-1' />
            <input
              value={startDate}
              placeholder=''
              onInput={handleStartDate}
              className={` bg-transparent h-6 w-full opacity-0`}
              type='date'
            />
          </div>
        </div>

        <div className='input-field w-full h-8 max-w-60 block my-2' id={'proAccount'}>
          <div className='relative flex'>
            <CalendarIcon onChange={handleEndDate} className=' absolute right-0 top-1 bottom-1' />
            <div className='absolute pointer-events-none left-0 top-1 bottom-1'>{endDate}</div>
            <input
              onInput={handleEndDate}
              value={endDate}
              placeholder=''
              className={` bg-transparent h-6 w-full opacity-0`}
              type='date'
            />
          </div>
        </div>
      </div>
      <div className='my-2'>
        <label className='font-semibold text-lg my-2 max-w-xs flex content-center gap-2 items-center'>
          Enable Registration Deadline
          <InfoInToolTip toolTipText={'Choose the start and end dates for your hackathon'} />
        </label>
        <ToolTipNew outerStyles={'w-40'} toolTipText={'Member registration not yet available'}>
          <SmallToggle disabled={true} toggleVal='Off' toggleFunc={() => null} names={['On', 'Off']} />
        </ToolTipNew>

        <div className='input-field w-full h-8 max-w-60 block my-2'>
          <ToolTipNew outerStyles={'w-52'} toolTipText={'Member registration not yet available'}>
            <div className='relative flex'>
              <CalendarIcon className=' absolute right-0 top-1 bottom-1' />
              <div className='absolute pointer-events-none left-0 top-1 bottom-1'></div>
              <input
                disabled={true}
                aria-label='registration deadline'
                onInput={handleEndDate}
                value={endDate}
                placeholder=''
                id={'registration deadline'}
                className={` bg-transparent h-6 w-full opacity-0 cursor-not-allowed`}
                type='date'
              />
            </div>
          </ToolTipNew>
        </div>
      </div>{' '}
    </>
  );
};

export default HackathonTime;
