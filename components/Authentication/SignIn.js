import React, { useContext, useState, useEffect } from "react";
import { useRouter } from 'next/router';
import StoreContext from "../../store/Store/StoreContext";

const SignIn = () => {
    const [appState, setAppState] = useContext(StoreContext);
    const router = useRouter();

    const signIn = () => {
        console.log(appState);
        const clientId = `client_id=${appState.clientId}`;
        const scopes = "scope=read:user%20public_repo";
        router.push(`https://github.com/login/oauth/authorize?${clientId}`);
    };

    return (
        <div>
            <button
                onClick={() => signIn()}
                className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
            >
                Sign In
            </button>
        </div>
    );
};

export default SignIn;
