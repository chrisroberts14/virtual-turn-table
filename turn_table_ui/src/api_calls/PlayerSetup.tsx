import type { Dispatch, SetStateAction } from "react";
const PlayerSetup = async (
	player: SpotifyPlayer,
	setIsPlayerReady: Dispatch<SetStateAction<boolean>>,
	setTrackPosition: Dispatch<SetStateAction<number>>,
) => {
	return player
		.connect()
		.then((success: boolean) => {
			if (!success) {
				setIsPlayerReady(false);
				throw new Error("Failed to connect to Spotify player.");
			}

			player.on("not_ready", (_: { device_id: string }) => {
				setIsPlayerReady(false);
				console.error("Device has gone offline unexpectedly.");
			});

			player.on(
				"player_state_changed",
				(state: { position: number; duration: number; paused: boolean }) => {
					setTrackPosition(state.position);
				},
			);
		})
		.catch((_: Error) => {
			throw new Error("Failed to connect to Spotify player.");
		});
};

export default PlayerSetup;
