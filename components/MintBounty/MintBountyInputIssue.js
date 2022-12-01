import React from 'react';
import ToolTipNew from '../Utils/ToolTipNew';
import BountyAlreadyMintedMessage from './BountyAlreadyMintedMessage';
import IssueDetailsBubble from './IssueDetailsBubble';

export default function MintBountyInputIssue({ setIssueUrl, issueData, isValidUrl, url, bountyAddress }) {
  return (
    <>
      <div className='flex flex-col py-2'>
        <div
          className={`flex flex-col gap-2 items-start self-start rounded-sm text-base bg-[#161B22] w-11/12 
      }`}
        >
          <div className='flex items-center gap-2 font-semibold'>
            Enter GitHub Issue URL
            <ToolTipNew mobileX={10} toolTipText={'Enter the link to the GitHub issue you would like to fund.'}>
              <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 text-sm box-content text-center font-bold text-primary'>
                ?
              </div>
            </ToolTipNew>
          </div>
          <input
            className={'flex-1 input-field w-full'}
            id='name'
            aria-label='issue url'
            placeholder='https://github.com/...'
            autoComplete='off'
            type='text'
            value={url}
            onChange={(event) => {
              setIssueUrl(event.target.value);
            }}
          />
          {isValidUrl && issueData?.url.includes('/issues/') ? <IssueDetailsBubble issueData={issueData} /> : null}
        </div>
      </div>
      {isValidUrl && !issueData?.url.includes('/issues/') && (
        <div className='flex flex-col items-center'>Github Issue not found</div>
      )}
      <div className='flex flex-col items-center space-x-1'>
        {isValidUrl && issueData?.url.includes('/issues/') && issueData?.closed && !bountyAddress && (
          <div className='text-center pt-3 '>This issue is already closed on GitHub</div>
        )}
        {isValidUrl && bountyAddress && issueData && (
          <BountyAlreadyMintedMessage closed={closed} id={issueData.id} bountyAddress={bountyAddress} />
        )}
      </div>
    </>
  );
}
