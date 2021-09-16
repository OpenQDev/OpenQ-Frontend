import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../store/AuthStore/AuthContext";

const SignOut = () => {
    const [authState, setAuthState] = useContext(AuthContext);

    const signOut = () => {
        setAuthState({ type: "LOGOUT" });
    };

    return (
        <div>
            <button
                onClick={() => signOut()}
                className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
            >
                Sign Out
            </button>
        </div>
    );
};

export default SignOut;
