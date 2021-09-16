import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../store/AuthStore/AuthContext";
import SignOut from "./SignOut";
import SignIn from "./SignIn";

const AuthButton = () => {
    const [authState, setAuthState] = useContext(AuthContext);

    return (
        <>
            {authState.isAuthenticated ? <SignOut /> : <SignIn />}
        </>
    );
};

export default AuthButton;
