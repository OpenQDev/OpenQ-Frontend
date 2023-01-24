import Image from 'next/image';
import React, { useState } from 'react';
import GithubConnection from '../../../User/OverviewTab/GithubConnection';
import ToolTipNew from '../../../Utils/ToolTipNew';

const index = () => {
  const [verified, setVerified] = useState(null);
  return (
    <section className='flex flex-col gap-3'>
      <h4 className='text-2xl flex content-center items-center gap-2 border-b border-gray-700 pb-2'>
        GitHub
        <div
          className={`${
            verified ? 'bg-[#1c6f2c] border-[#2ea043]' : 'bg-info border-info-strong'
          } border-2 text-sm px-2 rounded-full h-6`}
        >
          {verified ? 'Approved' : 'Required'}
        </div>
      </h4>
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
      <GithubConnection verified={verified} setVerified={setVerified} claimPage={true} />
      {verified && (
        <div key={2} className='flex items-center gap-2 btn-verified w-fit'>
          <Image src='/BountyMaterial/polyscan-white.png' width={20} height={20} alt='link-icon' />
          Verified
        </div>
      )}
    </section>
  );
};

export default index;
