// Third party
import React from 'react';
import { useRouter } from 'next/router';
// Custom
import Image from 'next/image';

const SignIn = ({ redirectUrl, styles }) => {
	const router = useRouter();

	const signIn = () => {
		const clientId = `client_id=${process.env.NEXT_PUBLIC_OPENQ_ID}`;
		const scopes = 'scope=read:user%20public_repo%20read:org';
		const nonce = randomString(10);
		window.localStorage.setItem('csrf_nonce', nonce);
		const state = {
			[nonce]: {
				redirectUrl,
			},
		};
		const stateParams = `state=${JSON.stringify(state)}`;
		router.push(
			`https://github.com/login/oauth/authorize?${clientId}&${scopes}&${stateParams}`
		);
	};

	function randomString(length) {
		return Array(length + 1)
			.join((Math.random().toString(36) + '00000000000000000').slice(2, 18))
			.slice(0, length);
	}

	return (
		<button
			onClick={() => signIn()}
			className={`col-span-3 font-mont rounded-lg border border-web-gray py-2 px-3 text-white font-bold cursor-pointer hover:border-white ${styles}`}
		>
			<div className="flex flex-row items-center justify-center space-x-3">
				<Image
					src="/github-logo-white.svg"
					alt="Picture of the author"
					width={20}
					height={20}
				/>
				<div>Sign In</div>
			</div>
		</button>
	);
};

export default SignIn;
