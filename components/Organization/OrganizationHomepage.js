// Third party
import React, { useState, useContext, useEffect } from 'react';
// Custom
import OrganizationCard from '../Organization/OrganizationCard';
import MintBountyButton from '../MintBounty/MintBountyButton';
import SearchBar from '../Search/SearchBar';
import Carousel from '../Utils/Carousel';
import HorizontalOrganizationCard from './HorizontalOrganizationCard';
import useWeb3 from '../../hooks/useWeb3';
import { UserContext } from '../../lib/UserContext';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

const OrganizationHomepage = ({ orgs, types, wizard }) => {
	const [user, setUser] = useContext(UserContext);
	// State
	const [organizationSearchTerm, setOrganizationSearchTerm] = useState('');
	const { account } = useWeb3();
	const filterByOrg = (e) => {
		setOrganizationSearchTerm(e.target.value);
	};

	const [magic, setMagic] = useState(null);

	useEffect(() => {
		let newMagic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
			extensions: [new OAuthExtension()],
		});

		setMagic(newMagic);
	}, []);

	const [disabled, setDisabled] = useState(false);

	const logout = () => {
		magic.user.logout().then(() => {
			setUser({ user: null });
		});
	};

	async function handleLoginWithEmail() {
		try {
			setDisabled(true); // disable login button to prevent multiple emails from being triggered

			// Trigger Magic link to be sent to user
			let didToken = await magic.auth.loginWithMagicLink({
				email,
				redirectURI: new URL('/auth/email', window.location.origin).href, // optional redirect back to your app after magic link is clicked
			});

			// Validate didToken with server
			const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + didToken,
				},
			});

			if (res.status === 200) {
				// Set the UserContext to the now logged in user
				let userMetadata = await magic.user.getMetadata();
				console.log(userMetadata);
				await setUser(userMetadata);
			}
		} catch (error) {
			setDisabled(false); // re-enable login button - user may have requested to edit their email
			console.log(error);
		}
	}

	const [email, setEmail] = useState(null);

	// Render
	return (
		<div>
			<div className='text-center bg-[#161B22] py-14'>
				<div className='text-2xl font-bold'>Organizations</div>
				<div className='text-gray-500 text-md'>GitHub organizations outsourcing to OpenQ</div>
			</div>
			<div className='lg:grid lg:grid-cols-extra-wide xl:grid-cols-wide justify-center md:pr-3 mx-4 sm:mx-8 '>
				<div className='lg:col-start-2 justify-between justify-self-center space-y-2 w-full pb-8 max-w-[966px] mx-auto'>
					<div className='flex flex-wrap items-center justify-center gap-4 w-full pt-10'>
						<SearchBar
							onKeyUp={filterByOrg}
							searchText={organizationSearchTerm}
							placeholder='Search Organization...'
							styles={'rounded-sm w-full'}
						/>
						<MintBountyButton wizard={wizard} styles={'w-full'} types={types} />
						<input placeholder='Enter your email'
							size='sm'
							value={email}
							onChange={(e) => setEmail(e.target.value)} />
						<button disabled={disabled} onClick={handleLoginWithEmail}>Sign In With Email</button>
						<button disabled={disabled} onClick={logout}>Logout</button>
						<div>{JSON.stringify(user)}</div>
					</div>
					<Carousel height={'80'}>
						{orgs
							.filter(
								(organization) =>
									organization.starringUserIds && organization.starringUserIds.some((user) => user === account)
							)
							.map((org, index) => {
								return <OrganizationCard key={index} index={index} organization={org} />;
							})}
					</Carousel>
					<div className='grid grid-cols-[repeat(3,_300px)] justify-center lg:justify-between'></div>
					<div className=''>
						{orgs
							.filter((organization) => {
								return organizationSearchTerm
									? organization.name?.toLowerCase().indexOf(organizationSearchTerm.toLowerCase()) > -1 ||
									organization.login?.toLowerCase().indexOf(organizationSearchTerm.toLowerCase()) > -1
									: organization;
							})
							.map((elem, index) => (
								<HorizontalOrganizationCard key={index} organization={elem} />
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrganizationHomepage;
