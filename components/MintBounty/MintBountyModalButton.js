import React from 'react';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import ToolTipNew from '../Utils/ToolTipNew';

export default function MintBountyModalButton({
  enableMint,
  transactionPending,
  mintBounty,
  issue,
  enableContest,
  isLoading,
  currentSum,
  sum,
}) {
  const enabled = enableContest && enableMint && !issue?.closed && issue?.url.includes('/issues/') && !isLoading;
  return (
    <ToolTipNew
      outerStyles={'hover:hidden -top-20 md:top-auto'}
      triangleStyles={'mt-7 md:mt-1 rotate-180 md:rotate-0 '}
      hideToolTip={(enableContest && enableMint && !issue?.closed && issue?.url.includes('/issues/')) || isLoading}
      toolTipText={
        issue?.closed && issue?.url.includes('/issues/')
          ? 'Issue closed'
          : !enableMint || !issue?.url.includes('/issues/')
          ? 'Please choose an elgible issue.'
          : currentSum !== sum
          ? 'Please make sure each tier gets a percentage.'
          : !enableContest
          ? 'Please make sure the sum of tier percentages adds up to 100.'
          : null
      }
    >
      <button
        className={`${enabled ? 'btn-primary cursor-pointer' : 'btn-primary cursor-not-allowed'}`}
        type='button'
        onClick={() => mintBounty()}
        disabled={!enabled}
      >
        {transactionPending ? (
          <div className='flex items-center gap-2'>
            Processing... <LoadingIcon bg='colored' />
          </div>
        ) : (
          'Deploy Contract'
        )}
      </button>
    </ToolTipNew>
  );
}
