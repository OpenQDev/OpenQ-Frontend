import Image from "next/image";
import DisplayPrice from "./BountyCardComps/DisplayPrice";

const BountyCardDetails = (props) => {
  const updateModal = () => {
    props.modalVisibility(false);
    props.onRequestClose();
  };

  return (
    <div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg  flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex flex-col pl-16 pr-16 pt-10 pb-10 border-b border-solid rounded-t">
              <div className="text-xl">smartcontract/chainlink</div>
              <div className="text-2xl font-bold">
                Render content directly from dom
              </div>
              <div className="flex flex-row pt-4 space-x-10">
                <div className="flex flex-col">
                  <div className="font-bold">Status</div>
                  <div className="flex flex-row items-center space-x-2">
                    <div className="pt-1">
                      {" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#15FB31"
                        viewBox="0 0 16 16"
                        width="15"
                        height="15"
                      >
                        <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                        <path
                          fillRule="evenodd"
                          d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
                        ></path>
                      </svg>
                    </div>
                    <div>Opened 3 days ago</div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="font-bold">Smart Contract</div>
                  <div className="flex flex-row items-center space-x-2">
                    <div className="1">
                      {" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#383838"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>0x75537828f...69CbFDbB714F1</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row pt-3 space-x-2">
                <button className="font-mont rounded-lg text-xs py-1 px-2 font-bold bg-purple-500 text-white">
                  Javascript
                </button>
                <button className="font-mont rounded-lg text-xs py-1 px-2 font-bold bg-pink-500 text-white">
                  Nodejs
                </button>
                <button className="font-mont rounded-lg text-xs py-1 px-2 font-bold bg-red-500 text-white">
                  Backend
                </button>
              </div>
              <div className="flex flex-col pt-4">
                <div className="font-semibold text-gray-700">
                  Total Value Locked (TVL)
                </div>
                <div className="font-bold text-xl">$243,13</div>
                <div className="flex flex-row space-x-2 pt-1">
                  <div className="flex pt-1 w-5 h-5 items-center">
                    {" "}
                    <DisplayPrice />
                  </div>
                  <div className="flex flex-row space-x-1 items-center">
                    <div>112,33</div>{" "}
                    <div className="flex font-semibold">DAI</div>
                  </div>
                </div>
              </div>
            </div>

            {/*body*/}
            <div className=" p-6 flex-auto">
              <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                Bounty Details
              </p>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => updateModal()}
              >
                Close
              </button>
              <button
                className="bg-emerald-500 text-gray-800 active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => updateModal()}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 bg-black"></div>
    </div>
  );
};

export default BountyCardDetails;
