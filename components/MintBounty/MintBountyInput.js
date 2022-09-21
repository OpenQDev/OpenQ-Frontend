import React from 'react';
import ToolTipNew from '../Utils/ToolTipNew';
import IssueDetailsBubble from './IssueDetailsBubble';

export default function MintBountyInput({ setIssueUrl, issueData, isValidUrl, url }) {
  return (
    <div className='flex flex-col w-full'>
      <div
        className={`flex flex-col w-full items-start p-2 rounded-sm py-1 text-base bg-[#161B22]  ${
          isValidUrl && issueData ? 'pt-5' : null
        }`}
      >
        <div className='flex items-center gap-2'>
          Enter GitHub Issue URL
          <ToolTipNew mobileX={10} toolTipText={'Enter the link to the GitHub issue you would like to fund.'}>
            <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 text-sm box-content text-center font-bold text-primary'>
              ?
            </div>
          </ToolTipNew>
        </div>
        <input
          className={'flex-1 input-field w-full mt-2 ml-4'}
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
      </div>
      {isValidUrl && issueData ? <IssueDetailsBubble issueData={issueData} /> : null}
    </div>
  );
}
