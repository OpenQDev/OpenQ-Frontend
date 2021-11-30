// Third Party
import React, { useContext, useEffect, useRef } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import axios from 'axios';

// Custom
import BountyCardDetails from './BountyCardDetails';

const BountyCardDetailsModal = (props) => {
	const { bounty } = props;
	const [appState] = useContext(StoreContext);

	let menuRef = useRef();

	useEffect(async () => {
		console.log('appState: ', appState.coinApiBaseUrl);
		let ethereum = 0.1;
		let bitcoin = 0.5;
		const data = {
			ethereum,
			bitcoin,
		};

		const url = appState.coinApiBaseUrl + '/tvl';
		console.log('url: ', url);

		// this is all i added, fetch overriding headers and the credentials: true on the server was messing something up
		await axios.post(url, data)
			.then((result) => {
				console.log(result);
			})
			.catch(error => {
				console.log(error);
			});

		/*  const res = await axios.post(url, data);
		console.log("res: ", res); */
	});

	const updateModal = () => {
		props.modalVisibility(false);
	};

	// close modal if clicked outside
	useEffect(() => {
		let handler = (event) => {
			if (!menuRef.current.contains(event.target)) {
				updateModal();
			}
		};
		window.addEventListener('mousedown', handler);

		return () => {
			window.removeEventListener('mousedown', handler);
		};
	});

	return (
		<div>
			<div className="justify-center font-mont items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div className="w-auto my-6 mx-auto max-w-3xl">
					<div
						ref={menuRef}
						className="rounded-lg shadow-lg  flex flex-col w-full bg-white"
					>
						<BountyCardDetails
							bounty={bounty}
							totalDeposits={props.totalDeposits}
						/>
					</div>
				</div>
			</div>
			<div className="opacity-25 fixed inset-0 bg-black"></div>
		</div>
	);
};

export default BountyCardDetailsModal;
