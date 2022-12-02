import React, { useContext } from 'react';
import ToolTipNew from '../../../Utils/ToolTipNew';
import MintContext from '../../MintContext';

const EnableRegistration = () => {
  const [mintState, mintDispatch] = useContext(MintContext);
  const { startDate, registrationDeadline, enableRegistration, category } = mintState;
  const handleStartDate = (e) => {
    const dispatch = {
      type: 'UPDATE_START_DATE',
      payload: e.target.value,
    };
    mintDispatch(dispatch);
  };

  const handleRegistrationDeadline = (e) => {
    const dispatch = {
      type: 'UPDATE_REGISTRATION_DEADLINE',
      payload: e.target.value,
    };
    mintDispatch(dispatch);
  };
  const handleRegistration = (e) => {
    const dispatch = {
      type: 'UPDATE_ENABLE_REGISTRATION',
      payload: e.target.checked,
    };
    mintDispatch(dispatch);
  };

  return (
    <>
      <div className=' flex flex-col gap-2 w-full py-2 items-start text-base bg-[#161B22]'>
        <div className='flex items-center gap-2 font-semibold'>
          Enable Hackathon Registration
          <input
            type='checkbox'
            className='checkbox'
            checked={enableRegistration}
            onChange={handleRegistration}
          ></input>
          <ToolTipNew
            mobileX={10}
            toolTipText={
              category === 'Fixed Price'
                ? 'Amount of funds you would like to escrow on this issue.'
                : 'How much will each successful submitter earn?'
            }
          >
            <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
              ?
            </div>
          </ToolTipNew>
        </div>
        <span className='text-sm '>
          Require contestants to sign up for your hackathon contests in this repo. This will allow you to set a
          timeline, be highlighted on OpenQ, and ensure you can connect with all participants post-hackathon.
        </span>
      </div>
      {enableRegistration ? (
        <>
          <div className='flex items-center gap-2'>Start Date</div>

          <input
            className={'flex-1 input-field w-full ml-2'}
            id='name'
            aria-label='issue url'
            placeholder='https://github.com/...'
            autoComplete='off'
            type='date'
            value={startDate}
            onChange={handleStartDate}
          />
          <div className='flex items-center gap-2'>End Date</div>

          <input
            className={'flex-1 input-field w-full ml-2'}
            id='name'
            aria-label='issue url'
            placeholder='https://github.com/...'
            autoComplete='off'
            type='date'
            value={registrationDeadline}
            onChange={handleRegistrationDeadline}
          />
        </>
      ) : null}
    </>
  );
};
export default EnableRegistration;
