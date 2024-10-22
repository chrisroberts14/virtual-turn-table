import axios from "axios";

const PlayTrack = async (token: string, trackURI: string, deviceId: string) => {
	axios
		.post(`${import.meta.env.VITE_BFF_ADDRESS}play_track/`, {
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
