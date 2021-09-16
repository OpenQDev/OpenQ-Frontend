class AuthSession {
    userId;
    accessToken;

    constructor(userId, accessToken) {
        this.userId = userId;
        this.accessToken = accessToken;
    }
}

export default AuthSession;