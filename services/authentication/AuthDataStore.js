import AuthSession from './AuthSession';

class AuthDataStore {
    constructor() { }

    isAuthenticated() {
        const authSession = this.readAuthSession();
        const isAuthenticated = authSession != "null";
        console.log(authSession);
        console.log(isAuthenticated);
        return isAuthenticated;
    }

    readAuthSession() {
        const jsonValue = window.localStorage.getItem('@authSession');
        const authSession = jsonValue != null ? JSON.parse(jsonValue) : null;
        return authSession;
    }

    save(authSession) {
        const jsonValue = JSON.stringify(authSession);
        window.localStorage.setItem('@authSession', jsonValue);
        return authSession;
    };

    delete() {
        window.localStorage.removeItem('@authSession');
    }
}

export default AuthDataStore;