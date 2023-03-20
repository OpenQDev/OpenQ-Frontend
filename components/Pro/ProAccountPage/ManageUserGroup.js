import React, { useContext, useState } from 'react';
import MemberManagementCard from './MemberManagementCard';
import { capitalize } from '../../../services/utils/lib';
import StoreContext from '../../../store/Store/StoreContext';
import InviteMemberModal from './InviteMemberModal.js';

const ManageUserGroup = ({ groupKey, proAccount, groupName }) => {
  const [inputtedUsername, setInputtedUsername] = useState('');
  const [appState] = useContext(StoreContext);
  const [addNewUser, setAddNewUser] = useState(false);
  const handleAddUser = async () => {
    const user = await appState.openQPrismaClient.getPublicUser(undefined, inputtedUsername);
    if (!user) return;
    const variables = {
      targetUserId: user.id,
      proAccountId: proAccount.id,
    };
    await appState.openQPrismaClient.addProAccountRole(variables, groupKey);
  };

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
      {proAccount[groupKey].nodes.map((member) => (
        <MemberManagementCard key={member.id} member={member} groupKey={groupKey} proAccountId={proAccount.id} />
      ))}
      {groupKey !== 'ownerUsers' && (
        <div>
          Add new {groupName}
          <input
            className='text-black'
            value={inputtedUsername}
            onChange={(e) => setInputtedUsername(e.target.value)}
          />
          <button
            onClick={handleAddUser}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          >
            Add User
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageUserGroup;
