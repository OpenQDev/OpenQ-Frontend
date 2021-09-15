import React, { useState, useEffect } from "react";
import axios from "axios";

function GitHubAuth({ Component, pageProps }) {
    const [authCode, setAuthCode] = useState("NO AUTH CODE");
    const [token, setToken] = useState("");

    useEffect(() => {
        // const params = new URLSearchParams(window.location.search);
        // params.has('code');
        // params.get('code');
        const params = new URLSearchParams(window.location.search);
        setAuthCode(params.get("code"));
        exchangeAuthCodeForAccessToken(params.get("code"));
    }, []);

    const exchangeAuthCodeForAccessToken = (authCode) => {
        axios.get(`https://development.openq.dev/auth?app=openq&code=${authCode}`)
            .then((res) => {
                setToken(res.data.access_token);
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
