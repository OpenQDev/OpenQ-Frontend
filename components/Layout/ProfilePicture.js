// Third Party
import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
// Custom
import AuthContext from '../../store/AuthStore/AuthContext';
import StoreContext from '../../store/Store/StoreContext';

const ProfilePicture = () => {
	const [authState] = useContext(AuthContext);
	const [appState] = useContext(StoreContext);

	const [propicUrl, setProPicUrl] = useState(null);

	useEffect(() => {
		async function setProfilePicture() {
			const isAuthenticated = authState.isAuthenticated;
			if (isAuthenticated) {
				const res = await appState.githubRepository.fetchAvatarUrl();
				const avatarUrl = res.data.viewer.avatarUrl;
				setProPicUrl(avatarUrl);
			}
		}
		setProfilePicture();
	}, [authState]);

	return (
		<>
			{propicUrl ? (
				<Image
					src={propicUrl}
					width={180}
					height={180}
					alt={'propic'}
					className="rounded-full"
				/>
			) : (
				<div></div>
			)}
		</>
	);
};

export default ProfilePicture;
