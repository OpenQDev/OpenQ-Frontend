import React, { useContext, useState } from 'react';
import MemberManagementCard from './MemberManagementCard';
import { capitalize } from '../../services/utils/lib';
import StoreContext from '../../store/Store/StoreContext';

const ManageUserGroup = ({ groupKey, proAccount, groupName }) => {
  const [inputtedUsername, setInputtedUsername] = useState('');
  const [appState] = useContext(StoreContext);
  const handleAddUser = async () => {
    const user = await appState.openQPrismaClient.getPublicUser(undefined, inputtedUsername);
    if (!user) return;
    console.log(user);
    const variables = {
      targetUserId: user.id,
      proAccountId: proAccount.id,
    };
    await appState.openQPrismaClient.addProAccountRole(variables, groupKey);
    console.log(groupKey, proAccount.id);
  };

  return (
    <div>
      <h2>{capitalize(groupName)}</h2>
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
