// Third Party
import React from 'react';
import { useRouter } from 'next/router';
// Custom
import Image from 'next/image';

const SignIn = ({ redirectUrl }) => {
	const router = useRouter();

	const signIn = () => {

		const clientId = `client_id=${process.env.NEXT_PUBLIC_OPENQ_ID}`;
		const scopes = 'scope=read:user%20public_repo';
		const nonce = randomString(10);
		window.localStorage.setItem('csrf_nonce', nonce);
		const state = {
			[nonce]: {
				redirectUrl
			}
		};
		const stateParams = `state=${JSON.stringify(state)}`;
		router.push(
			`https://github.com/login/oauth/authorize?${clientId}&${scopes}&${stateParams}`
		);
	};

	function randomString(length) {
		return Array(length + 1).join((Math.random().toString(36) + '00000000000000000').slice(2, 18)).slice(0, length);
	}

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
