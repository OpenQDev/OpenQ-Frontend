/* eslint-disable */
import { issueIds } from './mocks/data/issueIds';
import axios from 'axios';

class MockOpenQClient {
	constructor() { }

	async getAllIssues(library) {
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

	async getIssueDeposits(library, issueIdToAddresses) {
		return axios.get(`http://localhost:3030/getIssueDeposits`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}

	async mintBounty(library, issueId) {
		return { id: issueId, from: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', issueAddress: '0xB30dAf0240261Be564Cea33260F01213c47AAa0D' };
	}
}

export default MockOpenQClient;