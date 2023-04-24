import React, { useState } from 'react';
import MemberManagementCard from './MemberManagementCard';
import { capitalize } from '../../../services/utils/lib';
import InviteMemberModal from './InviteMemberModal.js';

const ManageUserGroup = ({ groupKey, teamAccount, groupName }) => {
  const [addNewUser, setAddNewUser] = useState(false);

  return (
    <div className='w-full'>
      <div className='bg-nav-bg flex content-center items-center justify-between border-t border-x border-web-gray rounded-t-sm w-full px-4 py-2  border border-web-gray'>
        <h3 className='py-1'>{capitalize(groupName)}</h3>
        {groupKey !== 'ownerUsers' && (
          <>
            {' '}
            <button onClick={() => setAddNewUser(true)} className='btn-primary'>
              Invite new member
            </button>
            {addNewUser && <InviteMemberModal setShowModal={setAddNewUser} />}
          </>
        )}
      </div>
      {teamAccount[groupKey].nodes.length === 0 && (
        <div className='border border-web-gray rounded-b-sm w-full px-4 py-2'>
          <p className='text-center'>No members in this group</p>
        </div>
      )}
      {teamAccount[groupKey].nodes.map((member) => (
        <MemberManagementCard key={member.id} member={member} groupKey={groupKey} teamAccountId={teamAccount.id} />
      ))}
    </div>
  );
};

export default ManageUserGroup;
