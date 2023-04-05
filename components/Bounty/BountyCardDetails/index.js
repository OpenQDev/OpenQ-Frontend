import React, { useContext, useEffect, useState } from 'react';

// Custom

import ActionBubble from '../../Utils/ActionBubble';
import StoreContext from '../../../store/Store/StoreContext';
import GithubHtmlRenderer from '../../Utils/HtmlReneder';

const BountyCardDetails = ({ bounty }) => {
  const [rendered, setRendered] = useState(false);
  const [appState] = useContext(StoreContext);
  const { bodyHTML } = bounty;

  useEffect(() => {
    setRendered(true);
  }, []);
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
  const issueClosedEvents = bounty.closedEvents.map((event) => {
    const issueClosedTime = new Date(bounty.closedAt).getTime() / 1000;

    return { ...event, issueClosedTime };
  });
  const deposits = bounty.deposits || [];
  const refunds = bounty.refunds || [];
  let claimedEvent = [];
  let closedEvents = [];
  if (bounty.bountyClosedTime && bounty.bountyType !== '0') {
    closedEvents = [{ closingTime: bounty.bountyClosedTime }];
  }
  if (bounty?.claims?.length) {
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

  return (
    <div className='flex-1 pr-4 min-w-[260px]'>
      {bodyHTML && (
        <GithubHtmlRenderer className={'w-full py-8 mb-2 border-web-gray border-b markdown-body'} html={bodyHTML} />
      )}
      {rendered && (
        <>
          {allActions.map((action, index) => (
            <ActionBubble suppressHydrationWarning key={index} bounty={bounty} action={action} />
          ))}
          <ActionBubble suppressHydrationWarning bounty={bounty} />
        </>
      )}
    </div>
  );
};

export default BountyCardDetails;
