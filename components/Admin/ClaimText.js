import React from 'react';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';

const ClaimText = ({ bounty }) => {
  return (
    <div className='col-span-3 space-y-4 p-4'>
      <p>
        {bounty.bountyType === '2' || bounty.bountyType === '3'
          ? 'Decide the winner by commenting OpenQ-Tier-[1,2,3]-Winner on the winning pull request:'
          : "Don't forget to add a closer comment for this bounty on your pull request :-)."}
      </p>
      <div>
        {bounty.bountyType === '2' || bounty.bountyType === '3' ? (
          bounty.payoutSchedule.map((elem, index) => {
            return (
              <CopyAddressToClipboard
                key={index}
                noClip={true}
                data={`Closes #${bounty.number} OpenQ-Tier-${index + 1}-Winner`}
              />
            );
          })
        ) : (
          <CopyAddressToClipboard noClip={true} data={`Closes #${bounty.number}`} />
        )}
      </div>
    </div>
  );
};
export default ClaimText;
