import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../store/AuthStore/AuthContext";

const SignIn = () => {
    const [appState, setAppState] = useContext(AuthContext);

    const signIn = () => {
        window.location = `https://github.com/login/oauth/authorize?${appState.clientId}`;
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
