import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import GithubConnection from '../../../User/OverviewTab/GithubConnection';
import ToolTipNew from '../../../Utils/ToolTipNew';

const GithubRequirement = ({ setGithubHasWalletVerified }) => {
  const [verified, setVerified] = useState(null);
  const [claimPageError, setClaimPageError] = useState('');
  useEffect(() => {
    if (verified) setGithubHasWalletVerified && setGithubHasWalletVerified(true);
  }, [verified]);
  return (
    <section className='flex flex-col gap-3'>
      <h4 className='text-2xl flex content-center items-center gap-2 border-b border-gray-700 pb-2'>
        GitHub
        <div
          className={`${
            verified ? 'bg-[#1c6f2c] border-[#2ea043]' : setGithubHasWalletVerified ? 'bg-info border-info-strong' : 'hidden'
          } border-2 text-sm px-2 rounded-full h-6`}
        >
          {verified ? 'Approved' : setGithubHasWalletVerified ? 'Required' : null}
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
        Associate your GitHub account on-chain{' '}
        <ToolTipNew
          innerStyles={'whitespace-normal w-60'}
          toolTipText={
            'You need to associate a wallet address to your GitHub account in order to be able to receive prizes.'
          }
        >
          <div className='cursor-help p-0.25 rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
            ?
          </div>
        </ToolTipNew>
      </div>
      <GithubConnection setVerified={setVerified} claimPage={true} setClaimPageError={setClaimPageError} />
    </section>
  );
};

export default GithubRequirement;
