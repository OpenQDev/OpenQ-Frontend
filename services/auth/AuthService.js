import axios from 'axios';

class AuthService {
  constructor() {}

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

  async checkAuth() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/checkAuth`, { withCredentials: true });
        const { isAuthenticated, avatar_url, login, email } = response.data;
        resolve({
          type: 'UPDATE_IS_AUTHENTICATED',
          payload: { isAuthenticated, avatarUrl: avatar_url, login, githubId: response.data.node_id, email },
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default AuthService;
