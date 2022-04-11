// Third Party
import React, { useContext } from 'react';
import axios from 'axios';
// Custom
import AuthContext from '../../store/AuthStore/AuthContext';
import Image from 'next/image';

const SignOut = ({ propicUrl, styles }) => {
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
			className={`col-span-3 font-mont py-2 rounded-lg border border-web-gray px-3 text-white font-bold cursor-pointer hover:border-white ${styles}`}
		>
			<div className="flex flex-row justify-center items-center space-x-3">
				<Image
					src={propicUrl || '/github-logo-white.svg'}
					alt="Picture of the author"
					width={24}
					height={24}
					className={'rounded-full'}
				/>
				<div>Sign Out</div>
			</div>
		</button>
	);
};

export default SignOut;
