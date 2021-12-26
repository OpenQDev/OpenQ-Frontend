import MockOpenQContractData from '../data/MockOpenQContractData.json';
class MockOpenQContract {
	constructor() { }
	async claimBounty(_id, _payoutAddress) { return new Promise((resolve, reject) => resolve(MockOpenQContractData['claimBounty'])); }
	async getIssueIds() { return new Promise((resolve, reject) => resolve(MockOpenQContractData['getIssueIds'])); }
	async issueIds(uint256) { return new Promise((resolve, reject) => resolve(MockOpenQContractData['issueIds'])); }
	async issueToAddress(string) { return new Promise((resolve, reject) => resolve(MockOpenQContractData['issueToAddress'])); }
	async mintBounty(_id) { return new Promise((resolve, reject) => resolve(MockOpenQContractData['mintBounty'])); }
	async tokenAddresses(uint256) { return new Promise((resolve, reject) => resolve(MockOpenQContractData['tokenAddresses'])); }
}
export default MockOpenQContract;