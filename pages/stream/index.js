import React, { useState, useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useWeb3 from '../../hooks/useWeb3';
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";

const stream = () => {
	const [appState] = useContext(StoreContext);
	const { activate, account, library } = useWeb3();
	//	this is the address in Mumbai testnet
	const xDai = "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f";
	const [recipient, setRecipient] = useState("");
	const [isButtonLoading, setIsButtonLoading] = useState(false);
	const [flowRate, setFlowRate] = useState("");
	const [flowRateDisplay, setFlowRateDisplay] = useState("");
	const [amount, setAmount] = useState("");

	async function approveToken(amount, callback) {
		const amountInWei = ethers.utils.parseEther(amount);
		const superToken = await appState.SuperFluidClient.loadSuperToken(
			library,
			xDai,
		);
		const unwrappedToken = superToken.underlyingToken.contract.connect(library.getSigner());
		console.log(unwrappedToken);
		try {
			const tx = await unwrappedToken.approve(xDai, amountInWei);
			console.log(tx);
			await tx.wait();
			callback();
		} catch (error) {
			console.log(error);
			callback();
		}
	}

	async function createNewFlowAndUpgrade(recipient, callback) {
		try {
			const tx = await appState.SuperFluidClient.upgradeAndCreateFlowBacth(
				library,
				xDai,
				flowRate,
				account,
				recipient
			);
			console.log("Creating your stream...");
			await tx.wait();
			console.log(tx);
			console.log(
				`Congrats - you've just created a money stream!
				View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
				Network: Mumbai
				Super Token: DAIx
				Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
				Receiver: ${recipient},
				FlowRate: ${flowRateDisplay}`
			);
			callback();
		} catch (error) {
			console.log(
				"Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
			);
			console.error(error);
			callback();
		}
	}

	async function updateFlow(recipient, callback) {
		try {
			const tx = await appState.SuperFluidClient.updateFlow(
				library,
				account,
				recipient,
				flowRate,
				xDai,
			);
			console.log("Updating your stream...");
			await tx.wait();
			console.log(tx);
			console.log(
				`Congrats - you've just updated a money stream!
				View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
				Network: Mumbai
				Super Token: DAIx
				Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
				Receiver: ${recipient},
				FlowRate: ${flowRateDisplay}`
			);
			callback();
		} catch (error) {
			console.log(
				"Hmmm, your transaction threw an error. Make sure that this stream does exist, and that you've entered a valid Ethereum address!"
			);
			console.error(error);
			callback();
		}
	}

	async function deleteFlow(recipient, callback) {
		try {
			const tx = await appState.SuperFluidClient.deleteFlow(
				library,
				account,
				recipient,
				xDai,
			);
			console.log("Deleting your stream...");
			await tx.wait();
			console.log(tx);
			console.log(
				`Congrats - you've just deleted a money stream!
				check it at: https://app.superfluid.finance/dashboard/${recipient}
				Network: Mumbai
				Super Token: DAIx
				Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
				Receiver: ${recipient},
				FlowRate: ${flowRateDisplay}`
			);
			callback();
		} catch (error) {
			console.log(
				"Hmmm, your transaction threw an error. Make sure that this stream  exist, and that you've entered a valid Ethereum address!"
			);
			console.error(error);
			callback();
		}
	}
	
	function calculateFlowRate(amount) {
		if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
			alert("You can only calculate a flowRate based on a number");
			return;
		} else if (typeof Number(amount) === "number") {
			if (Number(amount) === 0) {
				return 0;
			}
			const amountInWei = ethers.BigNumber.from(amount);
			const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
			const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
			return calculatedFlowRate;
		}
	}

	function CreateButton({ isLoading, children, ...props }) {
		return (
			<button variant="success" className="button" disabled={isButtonLoading} {...props} >
				{children}
			</button>
		);
	}

	const handleRecipientChange = (e) => {
		setRecipient(() => ([e.target.name] = e.target.value));
	};

	const handleFlowRateChange = (e) => {
		setFlowRate(() => ([e.target.name] = e.target.value));
		// if (typeof Number(flowRate) === "number") {
		let newFlowRateDisplay = calculateFlowRate(e.target.value);
		setFlowRateDisplay(newFlowRateDisplay.toString());
		// setFlowRateDisplay(() => calculateFlowRate(e.target.value));
		// }
	};

	const handleAmountChange = (e) => {
		setAmount(e.target.value);
	};

	return (
		<div>
			<h2 className="mb-3">
				Approve Tokens
			</h2>
			<form>
				<div className="mb-3 text-black">
					<input
						type="text"
						name="recipient"
						value={amount}
						onChange={handleAmountChange}
						placeholder="amount of tokens"
					/>
				</div>
				<CreateButton
					onClick={(e) => {
						e.preventDefault();
						setIsButtonLoading(true);
						approveToken(amount, () => {
							setIsButtonLoading(false);
							setAmount('');
						});
					}}
				>
					Approve the contract to move your tokens
				</CreateButton>
			</form>
			<h2 className="mb-3">
				Create a Flow
			</h2>
			<form>
				<div className="mb-3 text-black">
					<input
						type="text"
						name="recipient"
						value={recipient}
						onChange={handleRecipientChange}
						placeholder="Enter the receiver Ethereum address"
					/>
				</div>
				<div className="mb-3 text-black">
					<input
						type="text"
						name="flowRate"
						value={flowRate}
						onChange={handleFlowRateChange}
						placeholder="Enter a flowRate in wei/second"
					/>
				</div>
				<CreateButton
					onClick={(e) => {
						e.preventDefault();
						setIsButtonLoading(true);
						createNewFlowAndUpgrade(recipient, () => {
							setIsButtonLoading(false);
							setRecipient('');
							setFlowRate('');
							setFlowRateDisplay('');
						});
					}}
				>
					Click to Create Your Stream
				</CreateButton>
				<div className="description">
					<div className="calculation">
						<p>Your flow will be equal to:</p>
						<p>
							<b>${flowRateDisplay !== " " ? flowRateDisplay : 0}</b> DAIx/month
						</p>
					</div>
				</div>
			</form>
			<h2 className="mb-3">
				Update a Flow
			</h2>
			<form>
				<div className="mb-3 text-black">
					<input
						type="text"
						name="recipient"
						value={recipient}
						onChange={handleRecipientChange}
						placeholder="Enter the receiver Ethereum address"
					/>
				</div>
				<div className="mb-3 text-black">
					<input
						type="text"
						name="flowRate"
						value={flowRate}
						onChange={handleFlowRateChange}
						placeholder="Enter a flowRate in wei/second"
					/>
				</div>
				<CreateButton
					onClick={(e) => {
						e.preventDefault();
						setIsButtonLoading(true);
						updateFlow(recipient, () => {
							setIsButtonLoading(false);
							setRecipient('');
							setFlowRate('');
							setFlowRateDisplay('');
						});
					}}
				>
					Click to Update Your Stream
				</CreateButton>
				<div className="description">
					<div className="calculation">
						<p>Your flow will be equal to:</p>
						<p>
							<b>${flowRateDisplay !== " " ? flowRateDisplay : 0}</b> DAIx/month
						</p>
					</div>
				</div>
			</form>
			<h2 className="mb-3">
				Delete a Flow
			</h2>
			<form>
				<div className="mb-3 text-black">
					<input
						type="text"
						name="recipient"
						value={recipient}
						onChange={handleRecipientChange}
						placeholder="Enter the receiver Ethereum address"
					/>
				</div>
				<CreateButton
					onClick={(e) => {
						e.preventDefault();
						setIsButtonLoading(true);
						deleteFlow(recipient, () => {
							setIsButtonLoading(false);
							setRecipient('');
						});
					}}
				>
					Click to Delete Your Stream
				</CreateButton>
			</form>
		</div>
	);
};

export default stream;