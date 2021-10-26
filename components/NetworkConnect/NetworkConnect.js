import { useState, useEffect } from "react";

const NetworkConnect = (props) => {
    const [params, setParams] = useState([]);
    const [networkName, setNetworkName] = useState('');
    const [showButton, setShowButton] = useState(true);

    useEffect(() => {
        window.ethereum?.on('chainChanged', function (networkId) {
            updateCurrentNetwork();
        });

        window.ethereum?.on('accountsChanged', function (networkId) {
            updateCurrentNetwork();
        });

        updateCurrentNetwork();
    }, []);

    const updateCurrentNetwork = () => {
        if (window.ethereum?.selectedAddress == null) {
            setShowButton(false);
        } else {
            setShowButton(true);
        }

        const polygon = [{
            chainId: '0x89',
            chainName: 'Polygon Mainnet',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
            },
            rpcUrls: ['https://rpc-mainnet.maticvigil.com/v1/258e87c299409a354a268f96a06f9e6ae7ab8cea'],
            blockExplorerUrls: ['https://polygonscan.com/']
        }];

        /* Strange MetaMask quirk - if you've previously added the 31337 (0x7A69) chainId, it doesn't even look
            at the other params (it throws an error since http://localhost is not HTTPS)
            It just switches to localhost. Hacky, but works here...
        */
        const localhost = [{
            chainId: '0x7A69',
            chainName: 'Localhost 8545',
            nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
            },
            rpcUrls: ['https://localhost:8545'],
        }];

        const mumbai = [{
            chainId: '0x13881',
            chainName: 'Mumbai Testnet',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
            },
            rpcUrls: ['https://rpc-mumbai.maticvigil.com/v1/258e87c299409a354a268f96a06f9e6ae7ab8cea'],
            blockExplorerUrls: ['https://mumbai.polygonscan.com/']
        }];

        const chainId = window.ethereum?.networkVersion;
        const { deployEnv } = props;

        switch (props.deployEnv) {
            case "docker":
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

    const addOrSwitchNetwork = () => {
        window.ethereum?.request({ method: 'wallet_addEthereumChain', params })
            .catch((error) => console.log("Error", error.message));
    };

    const NetworkActionButton = () => {
        return (<button
            onClick={addOrSwitchNetwork}
            className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
        >
            Use {networkName} Network
        </button>);
    };

    if (showButton) {
        return (<button
            onClick={addOrSwitchNetwork}
            className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
        >
            Use {networkName} Network
        </button>);
    } else {
        return null;
    }
};

export default NetworkConnect;