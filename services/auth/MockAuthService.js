import axios from 'axios';

class MockAuthService {
	
	constructor() { }

	async hasSignature(library) {
		await sleep();

		return axios.get(`http://localhost:3030/hasSignature`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}

}

export default MockAuthService