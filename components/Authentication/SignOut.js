// Third party
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
			className="flex items-center btn-default whitespace-nowrap px-3 py-2 mr-2 hover:border-[#8b949e] hover:bg-[#30363d]"
		>
			<div className="flex flex-row justify-center items-center space-x-3">
				<Image
					src={propicUrl || '/social-icons/github-logo-white.svg'}
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
