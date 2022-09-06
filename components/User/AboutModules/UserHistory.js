// Third party
import React, { useState, useEffect, useContext } from 'react';
// Custom
import AvatarPack from '../../Utils/AvatarPack';
import StoreContext from '../../../store/Store/StoreContext';

const UserHistory = ({ payouts }) => {
  // Context
  const [appState] = useContext(StoreContext);

  // State
  const [organizations, updateOrganizations] = useState([]);

  useEffect(async () => {
    let didCancel;
    const fetchedOrgs = await appState.githubRepository.fetchOrganizationsByIds(
      payouts
        .map((p) => p.organization.id)
        .filter((itm, pos, self) => {
          return self.indexOf(itm) == pos;
        })
    );
    if (!didCancel) {
      updateOrganizations(fetchedOrgs);
    }
    return () => (didCancel = true);
  }, [payouts]);

  return (
    <div className='px-8 py-6 gap-6 border-t border-web-gray flex flex-wrap items-stretch w-full font-semibold text-lg'>
      {organizations && (
        <div className='flex-1 mb-6'>
          <div className='pb-2'>Organizations</div>
          {organizations.length === 0 ? (
            <div className='font-normal flex-1'>User hasn{"'"}t claimed a bounty with any organization.</div>
          ) : (
            <AvatarPack avatars={organizations} />
          )}
        </div>
      )}
      <div className='flex-1 whitespace-nowrap'>
        <div className='pb-2'>Bounties Collected</div>

        <div className=' text-base leading-[32px]'>{payouts.length}</div>
      </div>
    </div>
  );
};

export default UserHistory;
