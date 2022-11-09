import React, { useRef } from 'react';
import Cross from '../svg/cross';

const ModalLarge = ({ title, children, footerLeft, footerRight, setShowModal, resetState }) => {
  const modal = useRef();
  const updateModal = () => {
    resetState();
    setShowModal(false);
  };
  return (
    <div>
      <div className='flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50'>
        <div ref={modal} className='flex w-[480px] h-[600px] border border-gray-700 rounded-sm bg-[#161B22]'>
          <div className='flex flex-col relative w-full'>
            <button data-testid='cross' className='absolute top-4 right-4 cursor-pointer' onClick={() => updateModal()}>
              <Cross />
            </button>
            <div className='py-2 px-4 border-b border-gray-700 text-2xl w-full h-[50px]'>{title}</div>
            <div className='px-4 w-full h-[500px] overflow-x-hidden overflow-y-auto'>{children}</div>
            <div className='flex justify-between items-center py-2 px-4 border-t border-gray-700 w-full h-[50px]'>
              <div>{footerLeft}</div>
              <div>{footerRight}</div>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-overlay z-10 fixed inset-0'></div>
    </div>
  );
};

export default ModalLarge;
