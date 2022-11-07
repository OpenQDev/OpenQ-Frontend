// Third party
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import TokenBalances from '../TokenBalances/TokenBalances';
import useWeb3 from '../../hooks/useWeb3';

const MiniDepositCard = ({ deposit, showLink, id }) => {
  // Context
  const [appState] = useContext(StoreContext);

  const { account } = useWeb3();
  // State
  const [title, updateTitle] = useState('');
  const [tokenValues] = useGetTokenValues(deposit);

  // Hooks
  useEffect(() => {
    const getLink = async () => {
      if (showLink) {
        try {
          const fetchedTitle = await appState.githubRepository.fetchIssueById(deposit.bounty.bountyId);
          updateTitle(fetchedTitle.title);
        } catch (error) {
          appState.logger.error(error, account, id);
        }
      }
    };
    getLink();
  });

  // render
  return (
    <div
      key={deposit.id}
      className={
        'bg-web-gray/20  border-web-gray border px-4 pb-1 h-min rounded-sm max-w-[280px] lg:col-span-2 justify-self-center'
      }
    >
      {showLink && (
        <Link href={`/contract/${deposit.bounty.bountyId}/${deposit.bounty.id}`} legacyBehavior>
          <h3 className='text-xl font-semibold leading-none underline cursor-pointer pb-2'>{title}</h3>
        </Link>
      )}
      <TokenBalances tokenBalances={[deposit]} tokenValues={tokenValues} lean={true} singleCurrency={true} />
    </div>
  );
};

export default MiniDepositCard;
