// Third Party
import React, { useRef } from "react";

const ConfirmationModal = ({
  setShowConfirmationModal,
  positiveOption,
  confirmMethod,
  confirmationTitle,
  confirmationMessage,
  notificationRef,
}) => {
  const updateModal = () => {
    setShowConfirmationModal(false);
  };

  /*   let notifyRef = useRef();
  notificationRef(notifyRef); */

  return (
    <div>
      <div className="justify-center items-center font-mont flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="w-1/4">
          <div className="border-0 rounded-lg p-7 shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-center border-solid">
              <div className="flex flex-row">
                <div className="text-3xl font-semibold pb-8">
                  {confirmationTitle}
                </div>
                {/* <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => updateModal()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="black"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button> */}
              </div>
            </div>
            <div className="flex-auto">
              <p className="text-md text-gray-500 pb-12 text-center">
                {confirmationMessage}
              </p>
            </div>
            <div className="flex items-center">
              <button
                className="text-white background-transparent confirm-btn font-bold px-6 py-2 text-lg"
                type="button"
                onClick={() => {
                  updateModal();
                  confirmMethod();
                }}
              >
                {positiveOption}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 bg-black"></div>
    </div>
  );
};

export default ConfirmationModal;
