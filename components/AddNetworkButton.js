const AddNetworkButton = () => {
    const addNetwork = () => {
        const params = [{
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

        window.ethereum.request({ method: 'wallet_addEthereumChain', params })
            .then(() => console.log('Success'))
            .catch((error) => console.log("Error", error.message));
    };

    return (
        <div>
            <button
                onClick={addNetwork}
                className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
            >
                Add Polygon Network
            </button>
        </div>
    );
};

export default AddNetworkButton;