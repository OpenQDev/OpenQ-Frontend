// Third Party
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
// Custom
import StoreContext from '../../store/Store/StoreContext';
import Image from 'next/image';

const SignIn = () => {
	const [appState] = useContext(StoreContext);
	const router = useRouter();

	const signIn = () => {
		console.log(appState);
		const clientId = `client_id=${process.env.NEXT_PUBLIC_OPENQ_ID}`;
		const scopes = 'scope=read:user%20public_repo';
		router.push(
			`https://github.com/login/oauth/authorize?${clientId}&${scopes}`
		);
	};

	return (
		<button
			onClick={() => signIn()}
			className="flex flex-row justify-items-center pb-1 space-x-2 font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
		>
			<div className="">
				<Image
					src="/BountyMaterial/github.png"
					alt="Picture of the author"
					width={20}
					height={20}
				/>
			</div>
			<div>Sign In</div>
		</button>
	);
};

export default SignIn;
