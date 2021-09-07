const CreateBountyModal = (props) => {
  const updateModal = () => {
    props.modalVisibility(false);
  };

  const searchIssue = (event) => {
    event.preventDefault(); // don't redirect the page
    // where we'll add our form logic
    console.log("input submit: ", event.target.name.value);
  };

  const storeAmount = (event) => {
    event.preventDefault(); // don't redirect the page
    // where we'll add our form logic
    console.log("input submit: ", event.target.name.value);
  };
  return (
    <div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="w-2/7 my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-xl shadow-lg  flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex flex-col items-center justify-center p-5 rounded-t">
              <h3 className="text-3xl text-gray-700 font-semibold">
                Create Bounty
              </h3>
              <h3 className="text-2xl pt-3 w-2/3 text-center text-gray-300">
                Send funds to any GitHub Issue
              </h3>
            </div>
            {/*body*/}
            <div className="flex flex-col pl-6 pr-6 space-y-2">
              <div className="flex flex-row space-x-2 items-center p-2 font-mont rounded-lg py-1 text-base cursor-pointer bg-gray-100 text-white">
                <button
                  className="flex flex-row items-center font-mont rounded-lg px-4 py-2 text-base font-bold cursor-pointer bg-button-pink text-white hover:bg-pink-600 hover:text-white"
                  type="button"
                >
                  Bounty
                  <div className="pl-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                <div className="font-mont bg-gray-100 font-normal text-gray-600">
                  <form onSubmit={searchIssue}>
                    <input
                      className="bg-gray-100 w-6/7 border-gray-100 outline-none"
                      id="name"
                      placeholder="Issue URL"
                      type="text"
                    />
                    <button type="submit"></button>
                  </form>
                </div>
              </div>
              <div className="items-center justify-left p-6 w-full font-mont rounded-lg w-full py-3 text-base cursor-pointer bg-gray-100 text-white">
                <div className="font-mont font-normal text-gray-600">
                  {" "}
                  <div className="font-mont bg-gray-100 font-normal text-gray-600">
                    <form onSubmit={storeAmount}>
                      <input
                        className="bg-gray-100 w-6/7 border-gray-100 outline-none"
                        id="name"
                        placeholder="0"
                        type="text"
                      />
                      <button type="submit"></button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-center p-6 rounded-b w-full">
              <button
                className="confirm-btn"
                type="button"
                onClick={() => updateModal()}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 bg-black"></div>
    </div>
  );
};

export default CreateBountyModal;
