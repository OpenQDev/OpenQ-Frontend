import Link from 'next/link';
import React, { useState, useContext } from 'react';
import StyledInput from '../../../User/InvoicingDetailsTab/StyledInput';
import ToolTipNew from '../../../Utils/ToolTipNew';
import StoreContext from '../../../../store/Store/StoreContext';

const Email = ({ user }) => {
  console.log('user', user);
  const [email, setEmail] = useState(user.email);
  const [claimPageError] = useState('');

  const [appState] = useContext(StoreContext);
  // const { openQPrismaClient } = appState;
  const { accountData } = appState;

  return (
    <section className='flex flex-col gap-3'>
      <h4 className='text-2xl flex content-center items-center gap-2 border-b border-gray-700 pb-2'>
        Email
        <div
          className={`${
            email ? 'bg-[#1c6f2c] border-[#2ea043]' : setEmail ? 'bg-info border-info-strong' : 'hidden'
          } border-2 text-sm px-2 rounded-full h-6`}
        >
          {email ? 'Verified' : setEmail ? 'Required' : null}
        </div>
      </h4>
      {claimPageError && (
        <div className='bg-info border-info-strong border-2 p-3 rounded-sm'>
          Something went wrong, please try again or reach out for support at{' '}
          <Link
            href='https://discord.gg/puQVqEvVXn'
            rel='noopener norefferer'
            target='_blank'
            className='underline col-span-2'
          >
            OpenQ
          </Link>
          .
        </div>
      )}
      <div className='flex items-center gap-2'>
        Provide your email to communicate with EthDenver about W8/W9 forms{' '}
        <ToolTipNew
          innerStyles={'whitespace-normal w-60'}
          toolTipText={
            'You need to associate an email address to your OpenQ account in order to communicate with sponsors about receiving your prize.'
          }
        >
          <div className='cursor-help p-0.25 rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
            ?
          </div>
        </ToolTipNew>
      </div>
      <StyledInput
        highlightEmpty={true}
        defaultValue={accountData?.['email'] || 'foo@bar.com'}
        key={'email'}
        value={email}
        type={'text'}
        optional={false}
        displayValue={'EMAIL'}
      />
    </section>
  );
};

export default Email;
