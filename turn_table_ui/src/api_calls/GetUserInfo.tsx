import { userInfo } from "@/api_calls/BFFEndpoints.tsx";
import axios from "axios";
import type { Dispatch, SetStateAction } from "react";

const GetUserInfo = async (
	token: string | undefined,
	setDisplayName: Dispatch<SetStateAction<string>>,
	setEmail: Dispatch<SetStateAction<string>>,
	setProfileImage: Dispatch<SetStateAction<string>>,
) => {
	axios
		.get(userInfo, {
			params: {
				spotify_access_token: token,
			},
		})
		.then((response) => {
			setDisplayName(response.data.display_name);
			setEmail(response.data.email);
			setProfileImage(response.data.image_url);
		})
		.catch((error) => {
			throw new Error(error.response.data.message);
		});
};

export default GetUserInfo;
