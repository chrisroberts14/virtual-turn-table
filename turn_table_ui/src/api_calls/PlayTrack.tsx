import { playTrack } from "@/api_calls/BFFEndpoints.tsx";
import axios from "axios";

const PlayTrack = async (token: string, trackURI: string, deviceId: string) => {
	// Play a track on the user's Spotify account
	return axios
		.post(playTrack, {
			spotify_access_token: token,
			track_uri: trackURI,
			device_id: deviceId,
		})
		.catch((error) => {
			if (error.response) {
				throw new Error(error.response.data.message);
			}
		});
};

export default PlayTrack;
