// Third Party
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
// Custom
import StoreContext from '../../store/Store/StoreContext';

const SignIn = () => {
	const [appState,] = useContext(StoreContext);
	const router = useRouter();

	const signIn = () => {
		console.log(appState);
		const clientId = `client_id=${process.env.NEXT_PUBLIC_OPENQ_ID}`;
		const scopes = 'scope=read:user%20public_repo';
		router.push(`https://github.com/login/oauth/authorize?${clientId}&${scopes}`);
	};

	return (
		<button
			onClick={() => signIn()}
			className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
		>
			Sign In
		</button>
	);
};

export default SignIn;
