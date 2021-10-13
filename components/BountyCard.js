  import Image from "next/image";
import { useState } from "react";
import BountyCardDetails from "./BountyCardDetails";
import CopyAddressToClipboard from "./tools/CopyAddressToClipboard";

const BountyCard = (props) => {
  const { repoName, issueName, avatarUrl, labels, deposits, address } = props
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div>
      <div
        className="flex flex-col font-mont rounded-lg  bg-white shadow-md p-4 cursor-pointer"
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
            <div>{repoName}</div>
            </div>
            <div className="font-bold pl-6">
              {issueName}
            </div>
          </div>
          <div className="flex flex-col">
            <Image
              src={avatarUrl}
              alt="avatarUrl"
              width="51"
              height="51"
            />
          </div>
        </div>
        <div className="justify-left pl-5 pt-3">
        <CopyAddressToClipboard data={address}/>
        </div>
        <div className="flex flex-row justify-between pt-3 pl-6 pr-3">
          {labels.map((label, index) => {
              return <button key={index} className="font-mont rounded-md text-xs py-1 px-2 font-bold cursor-pointe bg-pink-500 text-white">{label.name}</button>
            })}
          <div className="flex flex-row space-x-2">
            <svg
              width="22"
              height="22"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0zm-.171 8H9.277v5.194H7v1.861h2.277v1.953H7v1.86h2.277V24h6.552c3.94 0 6.938-2.095 8.091-5.131H26v-1.86h-1.624c.04-.33.06-.668.06-1.01v-.046c0-.304-.016-.604-.047-.898H26v-1.86h-2.041C22.835 10.114 19.814 8 15.829 8zm6.084 10.869c-1.007 2.075-3.171 3.462-6.084 3.462h-4.72v-3.462zm.564-3.814c.042.307.064.622.064.944v.045c0 .329-.023.65-.067.964H11.108v-1.953h11.37zM15.83 9.666c2.926 0 5.097 1.424 6.098 3.528h-10.82V9.666h4.72z" />
            </svg>
            {deposits.map((deposit, index) => {
              return <div key={index} className="text-bold">{deposit.balance} : {deposit.symbol}</div>
            })}
          </div>
        </div>
      </div>
      {showModal && <BountyCardDetails modalVisibility={setShowModal} />}
    </div>
  );
};

export default BountyCard;
