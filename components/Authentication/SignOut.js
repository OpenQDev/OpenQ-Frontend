import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../store/AuthStore/AuthContext";
import StoreContext from "../../store/Store/StoreContext";

const SignOut = () => {
    const [authState, setAuthState] = useContext(AuthContext);
    const [appState, setAppState] = useContext(StoreContext);

    const signOut = () => {
        axios.get(appState.githubLogoutPath, { withCredentials: true })
            .then((res) => {
                setAuthState({ type: "UPDATE_IS_AUTHENTICATED", payload: res.data.isAuthenticated });
            })
            .catch((error) => {
                console.error(error);
            });
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
