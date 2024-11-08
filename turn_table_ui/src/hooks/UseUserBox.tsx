import GetUserInfo from "@/api_calls/GetUserInfo.tsx";
import { useUsername } from "@/contexts/UsernameContext.tsx";
import { clearStateData, getStateData } from "@/interfaces/StateData.tsx";
import { useEffect, useState } from "react";

const useUserBox = () => {
	const [profileImage, setProfileImage] = useState("");
	const { username, setUsername } = useUsername();

	useEffect(() => {
		const state = getStateData();
		if (state && "spotify_access_token" in state) {
			GetUserInfo(state.spotify_access_token)
				.then((response) => {
					if (response) {
						setUsername(response.display_name);
						setProfileImage(response.image_url);
					}
				})
				.catch((_) => {
					logout();
				});
		}
	}, [setUsername]);

	const logout = () => {
		clearStateData();
		window.location.href = "/";
	};

	return {
		profileImage,
		username,
		logout,
	};
};

export default useUserBox;
