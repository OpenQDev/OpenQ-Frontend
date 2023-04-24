import React, { useState, useContext } from 'react';
import ModalDefault from '../../../Utils/ModalDefault';
import StoreContext from '../../../../store/Store/StoreContext';
import TeamAccountContext from '../ProPageContext';
const CreateAccountModal = ({ showModal, setShowModal }) => {
  const [appState] = useContext(StoreContext);
  const [, setTeamAccountDispatch] = useContext(TeamAccountContext);

  const [error, setError] = useState();
  const { accountData } = appState;

  const CONFIRM = 'CONFIRM';
  const ERROR = 'ERROR';
  const [createAccountState, setCreateAccountState] = useState(CONFIRM);
  const { email, github, id } = accountData;
  const [name, setName] = useState('');
  const closeModal = () => {
    setCreateAccountState(CONFIRM);
    setShowModal(false);
  };
  const createTeamAccount = async (e) => {
    e.preventDefault();
    const idObj = github ? { github } : { email };
    try {
      const { createTeamAccount } = await appState.openQPrismaClient.createTeamAccount({ name, userId: id, ...idObj });
      setTeamAccountDispatch({ type: 'ADD_OWNER_ORGANIZATION', payload: createTeamAccount });
    } catch (e) {
      setCreateAccountState(ERROR);
      setError('Name already taken.');
    }
    setShowModal(false);
  };
  const rightBtnMap = {
    [CONFIRM]: (
      <button className='btn-primary' onClick={createTeamAccount}>
        Confirm
      </button>
    ),
    [ERROR]: (
      <button className='btn-default' onClick={closeModal}>
        Close Modal
      </button>
    ),
  };
  const leftBtnMap = {
    [CONFIRM]: (
      <button className='btn-default' onClick={closeModal}>
        Go Back
      </button>
    ),
    [ERROR]: <></>,
  };
  return (
    <>
      {showModal ? (
        <ModalDefault
          title={'Create Account'}
          footerRight={rightBtnMap[createAccountState]}
          footerLeft={leftBtnMap[createAccountState]}
          setShowModal={setShowModal}
          resetState={closeModal}
        >
          {createAccountState === CONFIRM && (
            <form className='px-4 space-y-4'>
              <label htmlFor='pro-name'>Name</label>
              <input
                id='pro-name'
                onChange={(e) => setName(e.target.value)}
                value={name}
                className='input-field block w-full'
                type='text'
                placeholder='Name'
              />
            </form>
          )}
          {createAccountState === ERROR && <div>{error}</div>}
        </ModalDefault>
      ) : null}
    </>
  );
};

export default CreateAccountModal;
