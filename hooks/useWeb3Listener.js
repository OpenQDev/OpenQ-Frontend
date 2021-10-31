import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injected } from '../components/WalletConnect/connectors';

export default function useWeb3Listener() {
    const { active, error, activate } = useWeb3React();

    useEffect(() => {
        const { ethereum } = window;
        if (ethereum && ethereum.on && !active && !error) {
            const handleConnect = () => {
                console.log("useWeb3Listener Handling 'connect' event");
            };
            const handleChainChanged = (chainId) => {
                console.log("useWeb3Listener Handling 'chainChanged' event with payload", chainId);
            };
            const handleAccountsChanged = (accounts) => {
                console.log("useWeb3Listener Handling 'accountsChanged' event with payload", accounts);
            };
            const handleNetworkChanged = (networkId) => {
                console.log("useWeb3Listener  Handling 'networkChanged' event with payload", networkId);
            };

            ethereum.on('connect', handleConnect);
            ethereum.on('chainChanged', handleChainChanged);
            ethereum.on('accountsChanged', handleAccountsChanged);
            ethereum.on('networkChanged', handleNetworkChanged);
        }
    }, [active, error, activate]);
}
