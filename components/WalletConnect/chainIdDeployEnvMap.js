/**
 * Map of the four deployment environments and their corresponding parameters.
 */
const chainIdDeployEnvMap = {
  local: {
    chainId: 31337,
    networkName: 'Localhost:8545',
    params: [
      {
        chainId: '0x7A69',
        chainName: 'Localhost 8545',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: ['https://localhost:8545'],
      },
    ],
  },
  docker: {
    chainId: 31337,
    networkName: 'Localhost:8545',
    params: [
      {
        chainId: '0x7A69',
        chainName: 'Localhost 8545',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: ['https://localhost:8545'],
      },
    ],
  },
  development: {
    chainId: 80001,
    networkName: 'Mumbai',
    params: [
      {
        chainId: '0x13881',
        chainName: 'Mumbai Testnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com/v1/258e87c299409a354a268f96a06f9e6ae7ab8cea'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
      },
    ],
  },
  staging: {
    chainId: 137,
    networkName: 'Polygon',
    params: [
      {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://rpc-mainnet.maticvigil.com/v1/258e87c299409a354a268f96a06f9e6ae7ab8cea'],
        blockExplorerUrls: ['https://polygonscan.com/'],
      },
    ],
  },
  production: {
    chainId: 137,
    networkName: 'Polygon',
    params: [
      {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://rpc-mainnet.maticvigil.com/v1/258e87c299409a354a268f96a06f9e6ae7ab8cea'],
        blockExplorerUrls: ['https://polygonscan.com/'],
      },
    ],
  },
};

export default chainIdDeployEnvMap;
