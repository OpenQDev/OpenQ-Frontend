import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthSession from "../../services/authentication/AuthSession";
import AuthContext from "../../store/AuthStore/AuthContext";
import { useRouter } from 'next/router';
import StoreContext from "../../store/Store/StoreContext";

function GitHubAuth({ Component, pageProps }) {
    const [appState, dispatch] = useContext(StoreContext);
    const router = useRouter();
    const [authCode, setAuthCode] = useState("NO AUTH CODE");
    const [token, setToken] = useState("");

    const [authState, setAuthState] = useContext(AuthContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setAuthCode(params.get("code"));
        exchangeAuthCodeForAccessToken(params.get("code"));
    }, []);

    const exchangeAuthCodeForAccessToken = (authCode) => {
        axios.get(`${appState.authBaseUrl}/?app=openq&code=${authCode}`, { withCredentials: true })
            .then((res) => {
                router.push(`${appState.baseUrl}`);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            AuthCode is: {authCode}
            <br />
            Token is: {token}
        </div>
    );
}

export default GitHubAuth;
