import { useEffect, useState, useContext } from "react";
import StoreContext from "../store/Store/StoreContext";
import { ethers } from 'ethers';

const CreateBountyModal = (props) => {
  const [appState, setAppState] = useContext(StoreContext);
  const [issueUrl, setIssueUrl] = useState("");
  const [orgName, setOrgName] = useState("");
  const [repoName, setRepoName] = useState("");
  const [issueId, setIssueId] = useState(0);
  const [issueData, setIssueData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [bountyAddress, setBountyAddress] = useState("No Issue Address Yet");

  const updateModal = () => {
    props.modalVisibility(false);
  };

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function getBountyAddress(id) {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(appState.openQAddress, appState.OpenQ.abi, provider);
      try {
        const bountyAddress = await contract.getBountyAddress(id);
        return bountyAddress;
      } catch (err) {
        console.log("getBountyAddress Error: ", err);
      }
    }
  }

  async function mintBounty(id) {
    if (typeof window.ethereum !== 'undefined') {
      const resp = await appState.githubRepository.fetchIssue(orgName, repoName, issueId);
      const globalIssueId = resp.data.organization.repository.issue.id;

      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(appState.openQAddress, appState.OpenQ.abi, signer);
      try {
        const transaction = await contract.mintBounty(globalIssueId);
        await transaction.wait();
        const address = await getBountyAddress(globalIssueId);
        setBountyAddress(address);
      } catch (error) {
        if (error?.data?.message.includes("Issue already exists for given id")) {
          alert("Issue already exists");
        }
        console.log(error);
      }
    }
  }

  const getDate = () => {
    const rawDate = issueData.data.organization.repository.issue.createdAt;
    const date = new Date(rawDate);
    return date.toDateString().split(" ").slice(1).join(" ");
  };

  useEffect(() => {
    // https://github.com/OpenQDev/contracts/issues/44
    let pathArray = appState.utils.parseGitHubUrl(issueUrl);
    const [orgName, repoName, issueId] = pathArray;
    setOrgName(orgName);
    setRepoName(repoName);
    setIssueId(issueId);
  }, [issueUrl, appState.utils]);

  useEffect(() => {
    async function fetchIssue() {
      if (orgName && repoName && issueId) {
        const response = await appState.githubRepository.fetchIssue(
          orgName,
          repoName,
          issueId
        );
        setIssueData(response);
        setIsLoading(false);
      }
    }
    fetchIssue();
  }, [issueId]);

  return (
    <div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="w-2/7 my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-xl shadow-lg  flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex flex-col items-center justify-center p-5 rounded-t">
              <h3 className="text-3xl text-gray-700 font-semibold">
                Mint Bounty
              </h3>
              <h3 className="text-2xl pt-3 w-2/3 text-center text-gray-300">
                Send funds to any GitHub Issue
              </h3>
            </div>
            <div className="flex flex-col pl-8 pr-6 space-y-2">
              <div className="border-gray-100 border-2 rounded-lg">
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
                    <input
                      className="bg-gray-100 w-6/7 border-gray-100 outline-none"
                      id="name"
                      placeholder="Issue URL"
                      autoComplete="off"
                      type="text"
                      onChange={(event) => {
                        setIssueUrl(event.target.value);
                      }}
                    />
                  </div>
                </div>
                {isLoading ? null : (
                  <div className="flex flex-col pb-3 pt-3 pl-5 font-mont">
                    <div className="flex flex-grow flex-row items-center space-x-2">
                      <div className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="#15FB31"
                          viewBox="0 0 16 16"
                          width="17"
                          height="17"
                        >
                          <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                          <path
                            fillRule="evenodd"
                            d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
                          ></path>
                        </svg>
                      </div>
                      <div className="text-sm">
                        {" "}
                        {issueData.data.organization.repository.issue.title}
                      </div>
                    </div>
                    <div className="text-xs pt-3 pl-6 text-gray-300">
                      {" "}
                      created at {getDate()} by{" "}
                      {
                        issueData.data.organization.repository.issue.author
                          .login
                      }
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-row items-center justify-left p-6 w-full font-mont rounded-lg w-full py-3 text-base cursor-pointer bg-gray-100 text-white">
                <div className="font-mont font-normal text-gray-600">
                  {" "}
                  <div className="font-mont bg-gray-100 font-normal text-gray-600">
                    {bountyAddress}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center p-6 rounded-b w-full">
              <button
                className="confirm-btn"
                type="button"
                onClick={() => mintBounty()}
              >
                Mint Bounty
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
