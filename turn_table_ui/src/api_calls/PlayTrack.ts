import { playTrack } from "@/api_calls/BFFEndpoints";
import axios from "axios";

const PlayTrack = async (token: string, trackURI: string, deviceId: string) => {
	// Play a track on the user's Spotify account
	// Use token to authenticate the user
	return axios
		.post(
			playTrack,
			{
				track_uri: trackURI,
				device_id: deviceId,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		)
		.catch((error) => {
			if (error.response) {
				throw new Error(error.response.data.message);
			}
		});
};

export default PlayTrack;
