import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

/* Note:
	const usdc = usdcx.underlyingToken.contract.connet(library.getSigner());
	const totalSupply = await usdc.totalSupply();

	this way you can access the underlaying token of some superToken
	and send transactions
*/

class SuperfluidClient {

	constructor() { }

	async createInstance(library) {
		try {
			if (!this.instance) {
				const tempInstance = await Framework.create({
					//networkName: "matic",
					chainId: 80001,
					provider: library,
				});
				this.instance = tempInstance;
				return tempInstance;
			}
			return this.instance;
		} catch (err) {
			console.log(err);
			console.log(library);
		}
	}

	async createSigner(library) {
		if (!this.signer) {
			const instance = await this.createInstance(library);
			const tempSigner = instance.createSigner({ web3Provider: library });
			this.signer = tempSigner;
		}
		return this.signer;
	}

	async loadSuperToken(library, address) {
		const instance = await this.createInstance(library);
		const token = await instance.loadSuperToken(address);
		return token;
	}

	calculateFlowRate(amount) {
		const monthlyAmount = ethers.utils.parseEther(amount.toString());
		const calculatedFlowRate = monthlyAmount.div(
			ethers.utils.formatUnits(60 * 60 * 24 * 30, 0)
		);
		return calculatedFlowRate.toString();
	}

	async superTokenCreateFlow(library, adddress, sender, receiver, flowRate) {
		const superToken = await this.loadSuperToken(library, adddress);
		const createFlowOp = superToken.createFlow({
			sender,
			receiver,
			flowRate,
		});
		return createFlowOp;
	}

	async upgradeToken(library, adddress, amount) {
		const superToken = await this.loadSuperToken(library, adddress);
		const upgradeOp = superToken.upgrade({
			amount: amount.toString(),
		});
		return upgradeOp;
	}

	async upgradeAndCreateFlowBacth(library, adddress, amount, sender, receiver) {
		const instance = await this.createInstance(library);
		const signer = await this.createSigner(library);
		const upgradeOp = await this.upgradeToken(
			library,
			adddress,
			ethers.utils.parseEther(amount.toString())
		);
		console.log(library);
		console.log(address);
		console.log(sender);
		console.log(receiver);
		console.log(this.calculateFlowRate(amount));
		const createFlowOp = await this.superTokenCreateFlow(
			library,
			adddress,
			sender,
			receiver,
			this.calculateFlowRate(amount),
		);

		return await instance.batchCall([
			upgradeOp,
			createFlowOp
		]).exec(signer);
	}

	async updateFlow(library, sender, receiver, flowRate, address) {
		const instance = await this.createInstance(library);
		const signer = await this.createSigner(library);
		const updateFlowOp = instance.cfaV1.updateFlow({
			superToken: address,
			sender,
			receiver,
			flowRate: this.calculateFlowRate(flowRate),
		});
		return await updateFlowOp.exec(signer);
	}
	async deleteFlow(library, sender, receiver, address) {
		const instance = await this.createInstance(library);
		const signer = await this.createSigner(library);
		const deleteFlowOp = instance.cfaV1.deleteFlow({
			superToken: address,
			sender,
			receiver,
		});
		return await deleteFlowOp.exec(signer);
	}

	async downgradeToken(library, amount, address) {
		const superToken = this.loadSuperToken(library, adddress);
		const upgradeOp = superToken.downgrade({
			amount: amount.toString(),
		});
		return await upgradeOp.exec(signer);
	}

	async getFlow(library, sender, receiver, address) {
		const instance = await this.createInstance(library);
		return instance.cfaV1.getFlow({
			superToken: address,
			sender,
			receiver,
		});
	}

	async getAccountFlowInfo(library, account, address) {
		const instance = await this.createInstance(library);
		return instance.cfaV1.getAccountFlowInfo({
			superToken: address,
			account,
		});
	}
	async getNetFlow(library, account, address) {
		const instance = await this.createInstance(library);
		return instance.cfaV1.getNetFlow({
			superToken: address,
			account,
		});
	}

	async balanceOf(library, account, address) {
		const superToken = this.loadSuperToken(library, adddress);
		return await superToken.balanceOf({ account });
	}

	async allowance(library, account, spender, adddress) {
		const superToken = this.loadSuperToken(library, adddress);
		return await superToken.allowance({
			account,
			spender,
		});
	}

	async realtimeBalanceOf(library, account, timestamp, adddress) {
		const superToken = this.loadSuperToken(library, adddress);
		return await superToken.realtimeBalanceOf({
			account,
			timestamp,
		});
	}
}

export default SuperfluidClient;