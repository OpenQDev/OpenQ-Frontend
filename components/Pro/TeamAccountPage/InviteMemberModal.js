import React, { useState, useContext } from 'react';
import ModalLarge from '../../Utils/ModalLarge';
import PaginatedList from '../../Utils/PaginatedList';
import StoreContext from '../../../store/Store/StoreContext';
import ListedUser from './ListedUser';

const InviteMemberModal = ({ setShowModal }) => {
  const [appState] = useContext(StoreContext);
  const title = 'Invite Member';
  const getItems = async (oldCursor, batch) => {
    const users = await appState.openQPrismaClient.getUsersPage({ limit: batch, cursor: oldCursor });

    return { nodes: users.nodes, cursor: users.cursor, complete: users.length !== batch };
  };
  const filterFunction = (item, filters) => {
    const filterVal = item.username?.toLowerCase().includes(filters.searchText.toLowerCase());

    return filterVal;
  };
  const paginationObj = {
    items: [],
    cursor: 0,
    complete: false,
    batch: 10,
    filters: { searchText: '' },
    filterFunction,
    getItems,
  };
  const paginationState = useState(paginationObj);
  const [paginationStateObj, setStatePaginationObj] = paginationState;
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
  const handleChange = (e) => {
    setStatePaginationObj({ ...paginationStateObj, filters: { searchText: e.target.value } });
  };
  return (
    <ModalLarge
      resetState={resetState}
      footerRight={rightBtn}
      closeModal={closeModal}
      setShowModal={setShowModal}
      title={title}
    >
      <div>
        <div className='p-4 border-b border-web-gray'>
          <input onChange={handleChange} placeholder='Find an OpenQ User' className='input-field w-full' />
        </div>
        <PaginatedList paginationState={paginationState} PaginationCard={ListedUser} />
      </div>
    </ModalLarge>
  );
};
export default InviteMemberModal;
