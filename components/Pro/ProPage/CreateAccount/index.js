import React, { useState } from 'react';
import CreateAccountModal from '../CreateAccountModal/index.js';

const CreateAccount = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className='border self-stretch justify-stretch border-web-gray w-60 h-32'>
      <h3>Create Account</h3>
      <button onClick={() => setShowModal(true)}>Open create modal</button>

      <CreateAccountModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};
export default CreateAccount;
