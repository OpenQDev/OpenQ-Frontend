// Third party
import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
// Custom
import AuthContext from '../../store/AuthStore/AuthContext';
import AuthButton from '../../components/Authentication/AuthButton';

const ProfilePicture = ({ mobile, contributor, styles }) => {

	// Context
	const [authState] = useContext(AuthContext);
	const router = useRouter();

	// State
	const [propicUrl, setProPicUrl] = useState(null);
	const [showModal, setShowModal] = useState(!authState.isAuthenticated);

	// Effects
	useEffect(() => {
		async function setProfilePicture() {
			const avatarUrl = authState.avatarUrl;
			setProPicUrl(avatarUrl);
		}
		setProfilePicture();
		if (authState.isAuthenticated) {
			setShowModal(false);
		}
	}, [authState]);

	return (
		<div className={`flex items-center h-12 content-center ${styles}`}>
		{console.log(showModal)}
			{showModal || !authState.isAuthenticated ?
				<div className={`flex w-max`}>
					<AuthButton redirectUrl={process.env.NEXT_PUBLIC_BASE_URL + router.asPath} propicUrl={propicUrl} styles="border-none" />
					{authState.isAuthenticated && <button onClick={() => setShowModal(false)}> </button>}
				</div> :
				<button className='flex items-center' onClick={() => setShowModal(true)}>
					{propicUrl != null ? (
						<Image
							src={propicUrl}
							width={mobile ? 31 : contributor? 310 : 31}
							height={mobile ? 31 : contributor? 310 : 31}
							alt={'profile pic'}
							className="rounded-full"

						/>
					) : null}
				</button>
			}
		</div>
	);
};

export default ProfilePicture;
