import React, { useRef, useEffect } from 'react';
import Cross from '../svg/cross';

const ModalDefault = ({ title, children, footerLeft, footerRight, setShowModal, resetState }) => {
  const modal = useRef();
  const updateModal = () => {
    if (typeof resetState === 'function') {
      resetState();
    }
    setShowModal(false);
  };

  useEffect(() => {
    // Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    function handleClickOutside(event) {
      if (modal.current && !modal?.current.contains(event.target)) {
        setShowModal(false);
        resetState();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modal]);

  return (
    <div>
      <div className='flex justify-center items-end sm:items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50'>
        <div
          ref={modal}
          className='flex w-full sm:w-[480px] h-[320px] border border-gray-700 sm:rounded-sm bg-[#161B22]'
        >
          <div className='flex flex-col relative w-full'>
            <button data-testid='cross' className='absolute top-4 right-4 cursor-pointer' onClick={() => updateModal()}>
              <Cross />
            </button>
            <div className='py-2 px-4 border-b border-gray-700 text-2xl w-full h-[50px]'>{title}</div>
            <div className='py-2 px-4 w-full h-[220px] overflow-x-hidden overflow-y-auto'>{children}</div>
            <div
              className={`flex ${
                footerLeft && footerRight ? 'justify-between' : 'justify-end'
              }  py-2 px-4 border-t border-gray-700 w-full h-[50px]`}
            >
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

export default ModalDefault;
