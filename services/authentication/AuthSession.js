class AuthSession {
    userId;
    accessToken;
    userVerified;

    constructor(userId, accessToken) {
        this.userId = userId;
        this.accessToken = accessToken;
    }
}

export default AuthSession;