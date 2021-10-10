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
        console.log(`${appState.baseUrl}${appState.oauthPort}/${appState.githubOAuthPath}?app=openq&code=${authCode}`);
        axios.get(`${appState.baseUrl}${appState.oauthPort}/${appState.githubOAuthPath}?app=openq&code=${authCode}`)
            .then((res) => {
                const accessToken = res.data.access_token;
                const authSession = new AuthSession("mockId", accessToken);

                setToken(accessToken);

                setAuthState({ type: "LOGIN", payload: { user: "mockUser", token: accessToken } });

                router.push(`${appState.baseUrl}${appState.frontendPort}`);
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
