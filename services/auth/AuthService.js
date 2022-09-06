import axios from 'axios';

class AuthService {
  constructor() {}

  async hasSignature(account) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/hasSignature?address=${account}`, {
          withCredentials: true,
        });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAccessToken(authCode) {
    const url = `${process.env.NEXT_PUBLIC_AUTH_URL}/?app=openq&code=${authCode}`;
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(url, { withCredentials: true });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }

  async verifySignature(account, signature) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/verifySignature`,
          {
            signature: signature,
            address: account,
          },
          { withCredentials: true }
        );
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }

  async checkAuth() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/checkAuth`, { withCredentials: true });
        const { isAuthenticated, avatarUrl, login } = response;
        resolve({ type: 'UPDATE_IS_AUTHENTICATED', payload: { isAuthenticated, avatarUrl, login } });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default AuthService;
