/* eslint-disable */
// import { issueIds } from './mocks/data/issueIds';
import axios from 'axios';

class MockOpenQClient {
	shouldSleep = 0;

	setSleep(time) {
		this.shouldSleep = time;
	}

	constructor() { }

	async sleep(time) {
		return new Promise(async (resolve, reject) => {
			setTimeout(time),
				resolve();
		});
	}

	async getAllIssues(library) {
		await sleep();

		return axios.get(`http://localhost:3030/getAllIssues`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}

	async getIssueAddresses(library, issues) {
		return axios.get(`http://localhost:3030/getIssueAddresses`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}

	async getIssueIsOpen(library, issueId) {
		return true;
	}

	async getIssueIdFromAddress(library, address) {
		return axios.get(`http://localhost:3030/getIssueIdFromAddress/${address}`)
			.then(result => {
				return result.data.issueId;
			})
			.catch(error => {
				console.error(error);
			});
	}

	async mintBounty(library, issueId, organization) {
		const promise = new Promise(async (resolve, reject) => {
			await this.sleep(1500);
			resolve({ "bountyAddress": "0x1abcD810374b2C0fCDD11cFA280Df9dA7970da4e", "txnReceipt": {} });
		});
		return promise;
	}
}

export default MockOpenQClient;