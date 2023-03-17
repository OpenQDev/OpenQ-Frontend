import React from 'react';
import ModalDefault from './ModalDefault';

const ConfirmTransactionModal = ({ setShowConfirm }) => {
  return (
    <>
      <ModalDefault
        title='Requesting Your Confirmation'
        setShowModal={setShowConfirm} /*resetState={setAssociateState} */
      >
        <div className='whitespace-pre-wrap'>Please confirm this transaction via your wallet.</div>
      </ModalDefault>
    </>
  );
};

export default ConfirmTransactionModal;
