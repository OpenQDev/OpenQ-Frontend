// Third Party
import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
// Custom
import AuthContext from '../store/AuthStore/AuthContext';
import StoreContext from '../store/Store/StoreContext';

const ProfilePicture = () => {
	const [authState,] = useContext(AuthContext);
	const [appState,] = useContext(StoreContext);

	const [propicUrl, setProPicUrl] = useState(null);

	useEffect(() => {
		async function setProfilePicture() {
			const isAuthenticated = authState.isAuthenticated;
			if (isAuthenticated) {
				const res = await appState.githubRepository.fetchAvatarUrl();
				const avatarUrl = res.data.viewer.avatarUrl;
				setProPicUrl(avatarUrl);
			} else {
				const openQLogo = 'https://avatars.githubusercontent.com/u/77402538?v=4';
				setProPicUrl(openQLogo);
			}
		}
		setProfilePicture();
	}, [authState]);

	return (
		<div>
			{propicUrl ? <Image src={propicUrl} width={50} height={50} alt={'propic'} /> : <div></div>}
		</div>
	);
};

export default ProfilePicture;
