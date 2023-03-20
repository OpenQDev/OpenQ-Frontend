import React, { useState, useContext } from 'react';
import ModalLarge from '../Utils/ModalLarge';
import PaginatedList from '../Utils/PaginatedList';
import StoreContext from '../../store/Store/StoreContext';
import ListedUser from './ListedUser';

const InviteMemberModal = ({ setShowModal }) => {
  const [appState] = useContext(StoreContext);
  const title = 'Invite Member';
  const getItems = async (oldCursor, batch) => {
    const users = await appState.openQPrismaClient.getUsersPage({ limit: batch, cursor: oldCursor });
    console.log(users, 'my users');
    return { nodes: users.nodes, cursor: users.cursor, complete: users.length !== batch };
  };
  const paginationObj = {
    items: [],
    cursor: 0,
    complete: false,
    batch: 10,
    filterFunction: () => true,
    getItems,
  };

  const paginationState = useState(paginationObj);
  /* {
	items: [],
	ordering: {direction: "desc", field: "name"},
	filters: {color: "blue"},
	cursor: 0,
	complete: false,
	batch: 10
}*/
  const closeModal = () => {
    setShowModal(false);
  };
  const resetState = () => {
    closeModal();
  };
  const rightBtn = (
    <button className='btn-default' onClick={closeModal}>
      Close Modal
    </button>
  );
  console.log(paginationState);
  return (
    <ModalLarge
      resetState={resetState}
      footerRight={rightBtn}
      closeModal={closeModal}
      setShowModal={setShowModal}
      title={title}
    >
      <div>
        <PaginatedList paginationState={paginationState} PaginationCard={ListedUser} />
      </div>
    </ModalLarge>
  );
};
export default InviteMemberModal;
