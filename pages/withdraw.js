import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/AuthStore/AuthContext";

function Withdraw() {
    const [authState, setAuthState] = useContext(AuthContext);

    useEffect(() => {
        console.log(authState);
        const token = window.localStorage.getItem('token');
        withdrawBounty(token);
    }, []);

    const withdrawBounty = (token) => {
        console.log(token);
        axios.post(`http://localhost:8090/withdraw`, {
            username: "alo9507",
            issueId: "sdf",
            payoutAddress: "sdf",
            oauthToken: token
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            Withdraw
        </div>
    );
}

export default Withdraw;
