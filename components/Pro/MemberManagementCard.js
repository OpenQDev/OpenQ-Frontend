import React from 'react';
import StoreContext from '../../store/Store/StoreContext';
import { useContext } from 'react';

const MemberManagementCard = ({ member, groupKey, proAccountId }) => {
  const [appState] = useContext(StoreContext);
  const removeMember = async () => {
    await appState.openQPrismaClient.removeProAccountRole({ targetUserId: member.id, proAccountId }, groupKey);
  };
  return (
    <div className='w-80 h-40 bg-green flex flex-col justify-between'>
      {' '}
      {member.username}
      {groupKey !== 'ownerUsers' && (
        <button onClick={removeMember} className='btn-danger'>
          Remove Member
        </button>
      )}
    </div>
  );
};

export default MemberManagementCard;
