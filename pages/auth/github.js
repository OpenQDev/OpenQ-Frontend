import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthSession from "../../services/authentication/AuthSession";
import StoreContext from "../../store/StoreContext";

function GitHubAuth({ Component, pageProps }) {
    const [authCode, setAuthCode] = useState("NO AUTH CODE");
    const [token, setToken] = useState("");
    const [appState, setAppState] = React.useContext(StoreContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setAuthCode(params.get("code"));
        exchangeAuthCodeForAccessToken(params.get("code"));
    }, []);

    const exchangeAuthCodeForAccessToken = (authCode) => {
        axios.get(`https://development.openq.dev/auth?app=openq&code=${authCode}`)
            .then((res) => {
                window.localStorage.setItem("res", JSON.stringify(res.data));
                const accessToken = res.data.access_token;
                const authSession = new AuthSession("mockId", accessToken);

                setToken(accessToken);

                appState.authDataStore.save(authSession);

                window.location = "http://localhost:3000";
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
