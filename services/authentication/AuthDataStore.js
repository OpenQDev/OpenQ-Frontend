import AuthSession from './AuthSession';

class AuthDataStore {
    constructor() { }

    readAuthSession() {
        const promise = new Promise((resolve, reject) => {
            try {
                const jsonValue = window.localStorage.getItem('@authSession');
                const authSession = jsonValue != null ? JSON.parse(jsonValue) : null;
                resolve(authSession);
            } catch (e) {
                reject(`Error retrieving auth session from data store: ", ${e}`);
            }
        });
        return promise;
    }

    save(authSession) {
        const promise = new Promise((resolve, reject) => {
            try {
                const jsonValue = JSON.stringify(authSession);
                window.localStorage.setItem('@authSession', jsonValue);
                resolve(authSession);
            } catch (e) {
                reject(`Error saving auth session: ${e}`);
            }
        });
        return promise;
    };

    delete() {
        const promise = new Promise(async (resolve, reject) => {
            try {
                await AsyncStorage.removeItem('@authSession');
                resolve(true);
            } catch (error) {
                reject(`Error deleting auth session: ${error}`);
            }
        });
        return promise;
    }
}

export default AuthDataStore;