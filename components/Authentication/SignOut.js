// Third Party
import React, { useContext } from 'react';
import axios from 'axios';
// Custom
import AuthContext from '../../store/AuthStore/AuthContext';
import Image from 'next/image';

const SignOut = () => {
	const [, setAuthState] = useContext(AuthContext);

	const signOut = () => {
		axios
			.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/logout`, {
				withCredentials: true,
			})
			.then((res) => {
				setAuthState({
					type: 'UPDATE_IS_AUTHENTICATED',
					payload: res.data.isAuthenticated,
				});
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<button
			onClick={() => signOut()}
			className="col-span-3 pb-1 space-x-2 font-mont rounded-lg border border-web-gray py-2 px-3 text-white font-bold cursor-pointer hover:border-white"
		>
			<div className="flex flex-row justify-center space-x-3">
				<div>
					<Image
						src="/BountyMaterial/github-white.png"
						alt="Picture of the author"
						width={20}
						height={20}
					/>
				</div>
				<div>Sign Out</div>
			</div>
		</button>
	);
};

export default SignOut;
