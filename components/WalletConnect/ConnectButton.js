import React, { useState, useContext, useEffect } from "react";

const ConnectButton = () => {

    async function connect() {

    }

    async function disconnect() {

    }

    return (
        <button
            onClick={connect}
            className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
        >
            Connect Wallet
        </button>
    );
};

export default ConnectButton;