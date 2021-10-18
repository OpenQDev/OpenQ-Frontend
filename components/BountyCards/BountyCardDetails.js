import Image from "next/image";
import DisplayPrice from "./BountyCardComps/DisplayPrice";

const BountyCardDetails = (props) => {
  const updateModal = () => {
    props.modalVisibility(false);
    props.onRequestClose();
  };

  return (
    <div>
      <div className="justify-center font-mont items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="rounded-lg shadow-lg  flex flex-col w-full bg-white">
            {/*header*/}
            <div className="flex flex-col pl-16 pr-16 pt-10 pb-10">
              <div className="flex flex-col border-b border-solid rounded-t">
                <div className="flex flex-row space-x-20 justify-between">
                  <div className="flex flex-col">
                    <div className="text-xl">smartcontract/chainlink</div>
                    <div className="text-2xl font-bold">
                      Render content directly from dom
                    </div>
                  </div>
                  <div>
                    <Image
                      src="/openq-logo.png"
                      alt="avatarUrl"
                      width="51"
                      height="51"
                    />
                  </div>
                </div>
                <div className="flex flex-row pt-5 space-x-10">
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
                <div className="flex flex-col pt-4 pb-6">
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
              <div className="flex flex-col pt-5">
                <div className="flex flex-row justify-between">
                  <div className="font-bold text-xl">Description</div>
                  <div className="flex flex-row font-bold text-xl space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#383838"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#383838"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="pt-2">This is a base description</div>
              </div>
            </div>

            {/*footer*/}
            {/*  <div className="flex items-center justify-end">
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
            </div> */}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 bg-black"></div>
    </div>
  );
};

export default BountyCardDetails;
