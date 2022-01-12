// Third Party
import React, { useState } from "react";
// Custom
import MintBountyModal from "./MintBountyModal";

const MintBountyButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="font-mont w-full rounded-lg border border-web-gray py-2 px-6 text-white font-semibold cursor-pointer hover:border-white"
      >
        Mint Bounty
      </button>
      {showModal && <MintBountyModal modalVisibility={setShowModal} />}
    </div>
  );
};

export default MintBountyButton;
