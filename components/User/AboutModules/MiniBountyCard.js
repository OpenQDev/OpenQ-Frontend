// Third party
import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';

import StoreContext from '../../../store/Store/StoreContext';
import useGetTokenValues from '../../../hooks/useGetTokenValues';
const MiniBountyCard = ({ payout }) => {
  // Context
  const [appState] = useContext(StoreContext);

  // State
  const [title, updateTitle] = useState('');
  const [tokenValues] = useGetTokenValues(payout);

  //Hooks
  useEffect(async () => {
    let didCancel;
    const fetchedTitle = await appState.githubRepository.fetchIssueById(payout.bounty.bountyId);
    if (!didCancel) {
      updateTitle(fetchedTitle.title);
    }
    return () => (didCancel = true);
  }, [payout]);

  return (
    <Link href={`/bounty/${payout.bounty.bountyId}/${payout.bounty.id}`}>
      <a>
        <div className='border-border-colour hover:bg-active-gray bg-inactive-gray border rounded-sm px-6 py-2 my-4 cursor-pointer'>
          <div className=''>{title}</div>

          {tokenValues
            ? `${appState.utils.formatter.format(tokenValues.total)}`
            : `${appState.utils.formatter.format(0)}`}
        </div>
      </a>
    </Link>
  );
};

export default MiniBountyCard;
