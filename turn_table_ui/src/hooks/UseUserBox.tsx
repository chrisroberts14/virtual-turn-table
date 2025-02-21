import GetUserInfo from "@/api_calls/GetUserInfo";
import { useUsername } from "@/contexts/UsernameContext";
import { clearStateData, getStateData } from "@/interfaces/StateData";
import { useEffect, useState } from "react";

const useUserBox = () => {
	const [profileImage, setProfileImage] = useState("");
	const { username, setUsername } = useUsername();
	const [isCollectionPublic, setIsCollectionPublic] = useState(false);

	useEffect(() => {
		const state = getStateData();
		if (state && "bff_token" in state) {
			GetUserInfo(state.bff_token)
				.then((response) => {
					if (response) {
						setUsername(response.display_name);
						setProfileImage(response.image_url);
						setIsCollectionPublic(response.is_collection_public);
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
		isCollectionPublic,
		setIsCollectionPublic,
	};
};

export default useUserBox;
