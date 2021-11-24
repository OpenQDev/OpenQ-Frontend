// Third Party
import router from "next/router";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

// Custom
import BountyCardDetails from "./BountyCardDetails";

const BountyCardDetailsModal = (props) => {
  const {
    issue,
    isClaimed,
    deposits,
    address,
    totalDeposits,
    modalVisibility,
  } = props;
  let menuRef = useRef();

  const updateModal = () => {
    modalVisibility(false);
    router.push("/");
  };

  // close modal if clicked outside
  useEffect(() => {
    let handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        updateModal();
      }
    };
    window.addEventListener("mousedown", handler);

    return () => {
      window.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div>
      <div className="justify-center font-mont items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="w-auto my-6 mx-auto max-w-3xl">
          <div
            ref={menuRef}
            className="rounded-lg shadow-lg  flex flex-col w-full bg-white"
          >
            <BountyCardDetails
              issue={issue}
              isClaimed={isClaimed}
              deposits={deposits}
              address={address}
              totalDeposits={totalDeposits}
            />
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 bg-black"></div>
    </div>
  );
};

export default BountyCardDetailsModal;
