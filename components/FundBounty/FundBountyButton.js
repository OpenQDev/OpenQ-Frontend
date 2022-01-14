import React, { useState } from "react";

// Custom
import FundModal from "./FundModal";

const FundBountyButton = ({ bounty }) => {
  const [showModal, setShowModal] = useState(false);

  function showTokenSearch() {
    setShowModal(true);
  }

  // Render
  return (
    <div>
      <button
        className="flex flex-row space-x-1 bg-button-pink font-semibold text-white rounded-lg p-2 pr-4 pl-4"
        onClick={() => showTokenSearch()}
      >
        Fund now
      </button>
      {showModal ? (
        <FundModal
          showModal={showModal}
          setShowModal={setShowModal}
          bounty={bounty}
        />
      ) : null}
    </div>
  );
};

export default FundBountyButton;
