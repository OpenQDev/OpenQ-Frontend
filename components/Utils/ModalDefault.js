import React, { useRef } from 'react';
import Cross from '../svg/cross';

const ModalDefault = ({ setShowModal, resetState }) => {
  const modal = useRef();
  const updateModal = () => {
    resetState();
    setShowModal(false);
  };
  return (
    <div>
      <div className='flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50'>
        <div ref={modal} className='flex w-[480px] h-[320px] border border-gray-700 rounded-sm bg-[#161B22]'>
          <div className='flex flex-col relative w-full'>
            <button data-testid='cross' className='absolute top-4 right-4 cursor-pointer' onClick={() => updateModal()}>
              <Cross />
            </button>
            <div className='py-2 px-4 border-b border-gray-700 text-2xl w-full h-[50px]'>Modal Title</div>
            <div className='py-2 px-4 w-full h-[220px] overflow-x-hidden overflow-y-auto'>
              Modal Body Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
              dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor
              sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
              id est laborum.
            </div>
            <div className='flex justify-end py-2 px-4 border-t border-gray-700 w-full h-[50px]'>
              <button className='btn-primary'>Modal Button</button>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-overlay z-10 fixed inset-0'></div>
    </div>
  );
};

export default ModalDefault;
