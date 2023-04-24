import React, { useContext, useState } from 'react';
import MemberManagementCard from './MemberManagementCard';
import { capitalize } from '../../../services/utils/lib';
import InviteMemberModal from './InviteMemberModal.js';
import TeamAccountContext from './TeamAccountContext';

const ManageUserGroup = ({ groupKey, groupName }) => {
  const [addNewUser, setAddNewUser] = useState(false);
  const [teamAccountState] = useContext(TeamAccountContext);
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
      {teamAccountState[groupKey].nodes.length === 0 && (
        <div className='border border-web-gray rounded-b-sm w-full px-4 py-2'>
          <p className='text-center'>No members in this group</p>
        </div>
      )}
      {teamAccountState[groupKey].nodes.map((member) => (
        <MemberManagementCard key={member.id} member={member} groupKey={groupKey} teamAccountId={teamAccountState.id} />
      ))}
    </div>
  );
};

export default ManageUserGroup;
