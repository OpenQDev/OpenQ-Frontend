import { useState } from "react";
import CreateBountyModal from "./createBountyModal/CreateBountyModal";

const CreateBounty = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="font-mont rounded-lg bg-button-pink py-2 px-3 pr-5 pl-5 text-white font-bold cursor-pointer"
      >
        Create Bounty
      </button>
      {showModal && <CreateBountyModal modalVisibility={setShowModal} />}
    </div>
  );
};

export default CreateBounty;
