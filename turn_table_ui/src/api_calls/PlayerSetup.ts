import type { Dispatch, SetStateAction } from "react";
const PlayerSetup = async (
	player: SpotifyPlayer,
	setIsPlayerReady: Dispatch<SetStateAction<boolean>>,
	setTrackPosition: Dispatch<SetStateAction<number>>,
) => {
	// Classified as an api call but could be considered a utility function
	// Creates the player instance and sets up event listeners
	return player
		.connect()
		.then((success: boolean) => {
			if (!success) {
				// Error if the player setup fails
				// Could be for many reasons:
				// - Spotify is down
				// - The user is not connected to the internet
				// - The user is not logged into Spotify (Though this code should never be called if the user is not logged in)
				setIsPlayerReady(false);
				throw new Error("Failed to connect to Spotify player.");
			}

			player.on("not_ready", (_: { device_id: string }) => {
				// Error if the player is not ready
				// Could be for many reasons:
				// - Spotify goes down
				// - The user loses connection to the internet
				setIsPlayerReady(false);
				console.error("Device has gone offline unexpectedly.");
			});

			player.on(
				"player_state_changed",
				(state: { position: number; duration: number; paused: boolean }) => {
					// Update the track position when the player state changes
					// This is pretty much only called on play/pause
					setTrackPosition(state.position);
				},
			);
		})
		.catch((_: Error) => {
			// Catch unknown errors
			throw new Error("Failed to connect to Spotify player.");
		});
};

export default PlayerSetup;
