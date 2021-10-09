import { useState, useEffect } from "react";

const AddNetworkButton = (props) => {
    const [params, setParams] = useState([]);
    const [networkName, setNetworkName] = useState('');

    useEffect(() => {
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

        switch (props.deployEnv) {
            case "docker":
                setNetworkName("Localhost");
                setParams(localhost);
                break;
            case "development":
                setNetworkName("Mumbai");
                setParams(mumbai);
                break;
            case "production":
                setNetworkName("Polygon");
                setParams(polygon);
                break;
            default:
                console.log("Error...");
                break;
        }
    }, []);

    const addNetwork = () => {
        window.ethereum.request({ method: 'wallet_addEthereumChain', params })
            .catch((error) => console.log("Error", error.message));
    };

    return (
        <div>
            <button
                onClick={addNetwork}
                className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
            >
                Add {networkName} Network
            </button>
        </div>
    );
};

export default AddNetworkButton;