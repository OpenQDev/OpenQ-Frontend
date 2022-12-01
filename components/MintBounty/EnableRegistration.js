import React from 'react';
import ToolTipNew from '../Utils/ToolTipNew';

const EnableRegistration = ({ enableRegistrationState, registrationDeadlineState, startDateState, category }) => {
  const [enableRegistration, setEnableRegistration] = enableRegistrationState;
  const [registrationDeadline, setRegistrationDeadline] = registrationDeadlineState;
  const [startDate, setStartDate] = startDateState;
  return (
    <>
      <div className=' flex flex-col gap-2 w-full py-2 items-start text-base bg-[#161B22]'>
        <div className='flex items-center gap-2 font-semibold'>
          Enable Hackathon Registration
          <input type='checkbox' className='checkbox' onChange={() => setEnableRegistration(true)}></input>
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
            onChange={(e) => setStartDate(e.target.value)}
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
            onChange={(e) => setRegistrationDeadline(e.target.value)}
          />
        </>
      ) : null}
    </>
  );
};
export default EnableRegistration;
