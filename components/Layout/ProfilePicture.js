// Third Party
import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
// Custom
import AuthContext from '../../store/AuthStore/AuthContext';

const ProfilePicture = () => {
	const [authState] = useContext(AuthContext);

	const [propicUrl, setProPicUrl] = useState(null);

	useEffect(() => {
		async function setProfilePicture() {
			const avatarUrl = authState.avatarUrl;
			setProPicUrl(avatarUrl);
		}
		setProfilePicture();
	}, [authState]);

	return (
		<>
			{propicUrl != null ? (
				<Image
					src={propicUrl}
					width={180}
					height={180}
					alt={'propic'}
					className="rounded-full"
				/>
			) : null}
		</>
	);
};

export default ProfilePicture;
