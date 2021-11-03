import MockFakeTokenContractData from '../data/MockFakeTokenContractData.json';
class MockFakeTokenContract {
	constructor() { }
	async admin() { return new Promise((resolve,) => resolve(MockFakeTokenContractData['admin'])); }
	async allowance(owner, spender) { return new Promise((resolve,) => resolve(MockFakeTokenContractData['allowance'])); }
	async approve(spender, amount) { return new Promise((resolve,) => resolve(MockFakeTokenContractData['approve'])); }
	async balanceOf(account) { return new Promise((resolve,) => resolve(MockFakeTokenContractData['balanceOf'])); }
	async decimals() { return new Promise((resolve,) => resolve(MockFakeTokenContractData['decimals'])); }
	async decreaseAllowance(spender, subtractedValue) { return new Promise((resolve,) => resolve(MockFakeTokenContractData['decreaseAllowance'])); }
	async increaseAllowance(spender, addedValue) { return new Promise((resolve,) => resolve(MockFakeTokenContractData['increaseAllowance'])); }
	async name() { return new Promise((resolve,) => resolve(MockFakeTokenContractData['name'])); }
	async symbol() { return new Promise((resolve,) => resolve(MockFakeTokenContractData['symbol'])); }
	async totalSupply() { return new Promise((resolve,) => resolve(MockFakeTokenContractData['totalSupply'])); }
	async transfer(recipient, amount) { return new Promise((resolve,) => resolve(MockFakeTokenContractData['transfer'])); }
	async transferFrom(sender, recipient, amount) { return new Promise((resolve,) => resolve(MockFakeTokenContractData['transferFrom'])); }
}
export default MockFakeTokenContract;