// Third Party
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

// Custom
import BountyCardDetails from "./BountyCardDetails";
import StoreContext from "../../store/Store/StoreContext";

const BountyCardDetailsModal = (props) => {
  const { issue, isClaimed, deposits, address } = props;
  const [tvl, setTvl] = useState(0);
  const [appState] = useContext(StoreContext);

  useEffect(async () => {
    let cleanedDeposits = {};
    deposits.map((d) => {
      let coin;
      if (d.name == "Fake") {
        coin = "ethereum";
      } else if (d.name == "Mock") {
        coin = "bitcoin";
      } else {
        coin = d.name;
      }
      cleanedDeposits[coin] = d.balance;
    });

    const data = cleanedDeposits;
    const url = appState.coinApiBaseUrl + "/tvl";

    // this is all i added, fetch overriding headers and the credentials: true on the server was messing something up
    await axios
      .post(url, data)
      .then((result) => {
        console.log(result);
        setTvl(result.data.total);
      })
      .catch((error) => {
        console.log(error);
      });

    /*  const res = await axios.post(url, data);
		console.log("res: ", res); */
  });

  const updateModal = () => {
    props.modalVisibility(false);
  };

  return (
    <div>
      <div className="justify-center font-mont items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="w-auto my-6 mx-auto max-w-3xl">
          <div className="rounded-lg shadow-lg  flex flex-col w-full bg-white">
            <BountyCardDetails
              issue={issue}
              isClaimed={isClaimed}
              deposits={deposits}
              address={address}
              totalDeposits={tvl}
            />
            <div className="flex items-center justify-end">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => updateModal()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 bg-black"></div>
    </div>
  );
};

export default BountyCardDetailsModal;
