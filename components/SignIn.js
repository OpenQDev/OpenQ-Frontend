import React from "react";

const SignIn = () => {

    const redirectToGithubAuth = () => {
        const clientId = "client_id=5fbd39c6916b7efb63cc";
        const scopes = "scope=read:user%20public_repo";
        window.location = `https://github.com/login/oauth/authorize?${clientId}`;
    };

    return (
        <div>
            <button
                onClick={() => redirectToGithubAuth()}
                className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
            >
                Sign In
            </button>
        </div>
    );
};

export default SignIn;
