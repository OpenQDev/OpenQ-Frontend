import React, { useState, useContext } from 'react';
import ModalDefault from '../../../Utils/ModalDefault';
import StoreContext from '../../../../store/Store/StoreContext';
const CreateAccountModal = ({ showModal, setShowModal }) => {
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const { email, github, id } = accountData;
  const userId = id;

  const [name, setName] = useState('');
  const btn = (
    <button className='btn-default' onClick={() => setShowModal(false)}>
      Close Modal
    </button>
  );
  const createProAccount = (e) => {
    e.preventDefault();
    const idObj = github ? { github } : { email };
    appState.openQPrismaClient.createProAccount({ name, userId, ...idObj });
  };
  return (
    <>
      {showModal ? (
        <ModalDefault
          title={'Create Account'}
          footerRight={btn}
          setShowModal={() => setShowModal({})}
          resetState={() => setShowModal({})}
        >
          <form className='px-4 space-y-4'>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className='input-field block w-full'
              type='text'
              placeholder='Name'
            />
            <button className='btn-primary' onClick={createProAccount}>
              Create Account
            </button>
          </form>
        </ModalDefault>
      ) : null}
    </>
  );
};

export default CreateAccountModal;
