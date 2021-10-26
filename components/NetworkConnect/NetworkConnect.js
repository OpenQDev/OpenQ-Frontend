import { useState, useEffect } from "react";
import { polygon, localhost, mumbai } from "./networks";

const NetworkConnect = (props) => {
    const [params, setParams] = useState([]);
    const [networkName, setNetworkName] = useState('');
    const [showButton, setShowButton] = useState(true);

    useEffect(() => {
        window.ethereum?.on('networkChanged', function (networkId) {
            updateCurrentNetwork();
        });

        window.ethereum?.on('accountsChanged', function (networkId) {
            updateCurrentNetwork();
        });

        updateCurrentNetwork();
    }, []);

    const updateCurrentNetwork = () => {
        if (window.ethereum?.selectedAddress === null) {
            setShowButton(false);
        } else {
            setShowButton(true);
        }

        const chainId = window.ethereum?.networkVersion;
        console.log(chainId);
        const { deployEnv } = props;

        switch (props.deployEnv) {
            case "docker":
                console.log("chainidddd", window.ethereum?.networkVersion);
                setNetworkName("Localhost");
                setParams(localhost);
                if (chainId == '31337') {
                    setShowButton(false);
                }
                break;
            case "development":
                setNetworkName("Mumbai");
                setParams(mumbai);
                if (chainId == '80001') {
                    setShowButton(false);
                }
                break;
            case "production":
                setNetworkName("Polygon");
                setParams(polygon);
                if (chainId == '137') {
                    setShowButton(false);
                }
                break;
            default:
                console.log("Error...");
                break;
        }
    };

    const useNetwork = () => {
        window.ethereum?.request({ method: 'wallet_addEthereumChain', params })
            .catch((error) => console.log("Error", error.message));
    };

    if (showButton) {
        return (<button
            onClick={useNetwork}
            className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
        >
            Use {networkName} Network
        </button>);
    } else {
        return null;
    }
};

export default NetworkConnect;