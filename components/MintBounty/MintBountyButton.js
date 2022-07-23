// Third party
import React, { useState } from "react";
// Custom
import MintBountyModal from "./MintBountyModal";

const MintBountyButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="lg:col-start-4 col-span-4 lg:col-span-1 whitespace-nowrap btn-primary"
      >
        <div className="flex flex-row space-x-3 items-center justify-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>New Contract</div>
        </div>
      </button>
			<div className="flex items-center">
      {showModal && <MintBountyModal modalVisibility={setShowModal} />}
			</div>
    </>
  );
};

export default MintBountyButton;
