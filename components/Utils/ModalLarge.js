import React, { useRef, useEffect, useContext } from 'react';
import Cross from '../svg/cross';
import StoreContext from '../../store/Store/StoreContext';

const ModalLarge = ({ title, children, footerLeft, footerRight, setShowModal, resetState, isWalletConnect }) => {
  const modal = useRef();
  const [appState] = useContext(StoreContext);
  const updateModal = () => {
    resetState();
    setShowModal(false);
  };

  useEffect(() => {
    // Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    function handleClickOutside(event) {
      if (modal.current && !modal?.current.contains(event.target) && !appState.walletConnectModal) {
        setShowModal(false);
        updateModal();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modal, appState.walletConnectModal]);

  return (
    <div>
      <div
        className={`flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 ${
          isWalletConnect && 'z-[51]'
        }`}
      >
        <div
          ref={modal}
          className='flex w-full md:w-[640px] h-full md:h-[600px] border border-gray-700 md:rounded-sm bg-[#161B22]'
        >
          <div className='flex flex-col relative w-full'>
            <button data-testid='cross' className='absolute top-4 right-4 cursor-pointer' onClick={() => updateModal()}>
              <Cross />
            </button>
            <div className='py-2 px-4 border-b border-gray-700 text-2xl w-full'>{title}</div>
            <div className='w-full h-full md:h-[500px] overflow-x-hidden overflow-y-auto'>{children}</div>
            <div className='flex justify-between items-center py-2 px-4 flex-wrap border-t border-gray-700 w-full '>
              <div className='my-1'>{footerLeft}</div>
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
