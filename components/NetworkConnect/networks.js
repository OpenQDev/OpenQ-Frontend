export const polygon = [{
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

export const localhost = [{
    chainId: '0x7A69',
    chainName: 'Localhost 8545',
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: ['https://localhost:8545'],
}];

export const mumbai = [{
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