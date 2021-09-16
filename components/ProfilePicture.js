import React, { useEffect, useState, useContext } from "react";
import StoreContext from "../store/StoreContext";
import Image from "next/image";

const ProfilePicture = () => {
    const [appState, setAppState] = React.useContext(StoreContext);

    const [propicUrl, setProPicUrl] = useState(null);

    useEffect(() => {
        async function readAuthSession() {
            const authSession = await appState.authDataStore.readAuthSession();
            if (authSession) {
                const res = await appState.githubRepository.fetchAvatarUrl();
                const avatarUrl = res.data.viewer.avatarUrl;
                setProPicUrl(avatarUrl);
            }
        }
        readAuthSession();
    }, []);

    return (
        <div>
            {propicUrl ? <Image src={propicUrl} width={50} height={50} alt={"propic"} /> : <div></div>}
        </div>
    );
};

export default ProfilePicture;
