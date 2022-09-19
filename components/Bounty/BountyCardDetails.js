import React, { useContext, useEffect } from 'react';

// Custom

import ActionBubble from '../Utils/ActionBubble';
import StoreContext from '../../store/Store/StoreContext';
import BountyMetadata from './BountyMetadata.js';
import useWeb3 from '../../hooks/useWeb3';
import useEns from '../../hooks/useENS';

const BountyCardDetails = ({ bounty, setInternalMenu, justMinted, tokenValues, budgetValues, split }) => {
  const [appState] = useContext(StoreContext);
  const { account } = useWeb3();
  const [senderEnsName] = useEns(bounty?.issuer?.id);
  const sender = senderEnsName || bounty?.issuer?.id;
  const price = tokenValues?.total;
  const budget = budgetValues?.total;
  const prs = bounty.prs.map((pr) => {
    const referencedTime = new Date(pr.referencedAt).getTime() / 1000;

    return { ...pr.source, referencedTime };
  });
  const mergedPrs = prs
    .filter((pr) => pr.mergedAt)
    .map((pr) => {
      const mergedTime = new Date(pr.mergedAt).getTime() / 1000;

      return { ...pr, mergedTime };
    });
  useEffect(() => {
    console.log(bounty);
  });
  const issueClosedEvents = bounty.closedEvents.map((event) => {
    const issueClosedTime = new Date(bounty.closedAt).getTime() / 1000;

    return { ...event, issueClosedTime };
  });
  console.log(issueClosedEvents);
  const deposits = bounty.deposits || [];
  const refunds = bounty.refunds || [];
  let claimedEvent = [];
  let closedEvents = [];
  if (bounty.bountyClosedTime && bounty.bountyType !== '0') {
    closedEvents = [{ closingTime: bounty.bountyClosedTime }];
  }
  if (bounty.claims?.length) {
    claimedEvent = bounty.claims;
  }
  /*
  const depositsAndRefunds = appState.utils.mergeOrdered(deposits, refunds, 'receiveTime', 'refundTime');
  const normalizedDepositsAndRefunds = depositsAndRefunds.map((action) => {
    const time = action.receiveTime || action.refundTime;
    return { ...action, time };
  });

  const claimsAndCloses = appState.utils.mergeOrdered(closedEvents, claimedEvent, 'time', 'claimTime');
  const normalizedClaimsAndCloses = claimsAndCloses.map((action) => {
    const closingTime = action.claimTime || action.time;
    return { ...action, closingTime };
  });*/
  const allActions = appState.utils.mergeOrdered([
    { arr: deposits, prop: 'receiveTime' },
    { arr: refunds, prop: 'refundTime' },
    { arr: closedEvents, prop: 'closingTime' },
    { arr: claimedEvent, prop: 'claimTime' },
    { arr: prs, prop: 'referencedTime' },
    { arr: mergedPrs, prop: 'mergedTime' },
    { arr: issueClosedEvents, prop: 'issueClosedTime' },
  ]);

  const addresses = deposits.reduce(
    (accum, elem) => {
      if (accum.includes(elem.sender.id)) {
        return accum;
      }
      return [...accum, elem.sender.id];
    },
    [sender?.toLowerCase() || (justMinted && account)]
  );

  return (
    <div className='flex w-full px-2 sm:px-8 flex-wrap max-w-[1200px] pb-8 mx-auto'>
      <div className='flex-1 pr-4 min-w-[260px]'>
        {allActions.map((action, index) => (
          <ActionBubble
            address={action.sender?.id || action.claimant?.id || sender}
            key={index}
            bounty={bounty}
            action={action}
          />
        ))}
        <ActionBubble
          addresses={addresses}
          address={sender}
          price={tokenValues?.total}
          bounty={bounty}
          bodyHTML={bounty.bodyHTML}
        />
      </div>
      <BountyMetadata bounty={bounty} setInternalMenu={setInternalMenu} price={price} budget={budget} split={split} />
    </div>
  );
};

export default BountyCardDetails;
