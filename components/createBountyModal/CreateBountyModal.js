import IssueRepository from "../../services/IssueRepository";
import TokenDropdown from "./TokenDropdown";
import { useEffect, useState } from "react";
import { getDefaultValues } from "@apollo/client/utilities";

const CreateBountyModal = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orgName, setOrgName] = useState("");
  const [repoName, setRepoName] = useState("");
  const [repoId, setRepoId] = useState("");
  const [issueData, setIssueData] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  const getDate = () => {
    const rawDate = issueData.data.organization.repository.issue.createdAt;
    const date = new Date(rawDate);
    return date.toDateString().split(" ").slice(1).join(" ");
  };

  //#endregion
  useEffect(() => {
    const gitHubHome = "https://github.com/";

    /*
    Query GitHub issue link to fetch graphQL API
    A correct search string looks like this:
    https://github.com/openqdev/app/issues/86


    Currently doesnt support any error handling
    */
    if (gitHubHome === searchTerm.slice(0, 19)) {
      const orgStringIndex = 19 + parseInt(searchTerm.slice(19).search("/"));
      if (orgStringIndex > 18) {
        setOrgName(searchTerm.slice(19, orgStringIndex));
        const repoStringIndex =
          orgStringIndex +
          parseInt(searchTerm.slice(orgStringIndex + 1).search("/"));
        if (repoStringIndex > orgStringIndex + 1) {
          setRepoName(
            searchTerm.slice(orgStringIndex + 1, repoStringIndex + 1)
          );
          const issueIdIndex = repoStringIndex + 9;
          const issueId = searchTerm.slice(issueIdIndex);
          if (issueId) {
            setRepoId(issueId);
          }
        }
      }
    }
  });

  useEffect(async () => {
    /* Fetch issue data if search query is complete
       TODO: Throws error and breaks if URL does not exist
    */
    if (orgName && repoName && repoId) {
      const issueRepository = new IssueRepository();
      const response = await issueRepository.fetchIssue(
        orgName,
        repoName,
        parseInt(repoId)
      );
      /*   console.log("res: ", response.data.organization.repository); */
      setIssueData(response);
      setIsLoading(false);
    }
  }, [repoId]);

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
                        setSearchTerm(event.target.value);
                      }}
                    />
                  </div>
                </div>
                {/*   Conditional Issue Data */}
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
                <div className="dropdown">{/*  <TokenDropdown /> */}</div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-center p-6 rounded-b w-full">
              <button
                className="confirm-btn"
                type="button"
                onClick={() => updateModal()}
              >
                Create Bounty
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
