import MockOpenQContract from './mocks/contracts/MockOpenQContract';
import MockFakeTokenContract from './mocks/contracts/MockFakeTokenContract';

class MockOpenQClient {
	constructor() { }

	OpenQ = (address, providerOrSigner) => {
		return new MockOpenQContract();
	};

	ERC20 = (address, providerOrSigner) => {
		return new MockFakeTokenContract();
	};
}

export default MockOpenQClient;