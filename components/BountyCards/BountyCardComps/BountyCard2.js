import Image from "next/image";
import { useState } from "react";
import BountyCardDetails from "./BountyCardDetails";
import CopyAddressToClipboard from "../tools/CopyAddressToClipboard";
import DisplayPrice from "./BountyCardComps/DisplayPrice";

const BountyCard = (props) => {
  const { orgName, repoName, issueName, avatarUrl, labels, deposits, address } =
    props;
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div
        className="flex flex-col font-mont rounded-lg bg-white shadow p-4 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="flex flex-row justify-between">
          <div>
            <div className="flex flex-grow flex-row items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#15FB31"
                viewBox="0 0 16 16"
                width="16"
                height="16"
              >
                <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                <path
                  fillRule="evenodd"
                  d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
                ></path>
              </svg>
              <div>
                {orgName.toLowerCase()}/{repoName.toLowerCase()}
              </div>
            </div>
            <div className="font-bold pl-6">
              {issueName.charAt(0).toUpperCase() + issueName.slice(1)}
            </div>
          </div>
          <div className="flex flex-col">
            <Image src={avatarUrl} alt="avatarUrl" width="51" height="51" />
          </div>
        </div>
        {/* <div className="justify-left pl-5 pt-1">
          <CopyAddressToClipboard data={address} />
        </div> */}
        {/*  Please make this better  */}
        {labels ? (
          <div className="flex flex-row pt-3 pl-6 pr-3 justify-between">
            <div className="space-x-2">
              {labels.map((label, index) => {
                if (index < 2) {
                  return (
                    <button
                      key={index}
                      className="font-mont rounded-lg text-xs py-1 px-2 font-bold bg-purple-500 text-white"
                    >
                      {label.name}
                    </button>
                  );
                } else if (index == 2) {
                  return (
                    <button
                      key={index}
                      className="font-mont rounded-lg text-xs py-1 px-2 font-bold bg-purple-500 text-white"
                    >
                      more..
                    </button>
                  );
                } else {
                  null;
                }
              })}
            </div>
            <div className="flex flex-row space-x-2">
              <DisplayPrice />
              <div className="">10 DAI</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-row space-x-2 justify-end">
            <DisplayPrice />
            <div className="">10 DAI</div>
          </div>
        )}
      </div>
      {showModal && <BountyCardDetails modalVisibility={setShowModal} />}
    </div>
  );
};

export default BountyCard;
