// Third party
import React from 'react';
import ModalDefault from '../Utils/ModalDefault';

const ErrorModal = ({ setShowErrorModal, error }) => {
  const { title, message } = error;

  const updateModal = () => {
    setShowErrorModal(false);
  };

  const btn = (
    <button className='btn-default w-full' type='button' onClick={() => updateModal()}>
      Close
    </button>
  );

  return (
    <ModalDefault title={title} footerRight={btn} setShowModal={setShowErrorModal} resetState={updateModal}>
      <div>{message}</div>
    </ModalDefault>
  );
};

export default ErrorModal;
