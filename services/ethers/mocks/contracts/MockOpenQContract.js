import MockOpenQContractData from '../data/MockOpenQContractData.json';
class MockOpenQContract {
    constructor() { }
    addTokenAddress(tokenAddress) { return MockOpenQContractData[addTokenAddress]; }
    claimBounty(_id, _payoutAddress) { return MockOpenQContractData[claimBounty]; }
    getBountyAddress(_id) { return MockOpenQContractData[getBountyAddress]; }
    getIssueIds() { return MockOpenQContractData[getIssueIds]; }
    issueIds(uint256) { return MockOpenQContractData[issueIds]; }
    issueToAddress(string) { return MockOpenQContractData[issueToAddress]; }
    mintBounty(_id) { return MockOpenQContractData[mintBounty]; }
    tokenAddresses(uint256) { return MockOpenQContractData[tokenAddresses]; }
}
export default MockOpenQContract;