import type { Dispatch, SetStateAction } from "react";
const PlayerSetup = async (
	player: SpotifyPlayer,
	setDeviceId: Dispatch<SetStateAction<string>>,
	setPlayer: Dispatch<SetStateAction<SpotifyPlayer | null>>,
	setIsPaused: Dispatch<SetStateAction<boolean>>,
	setTrackPosition: Dispatch<SetStateAction<number>>,
	setTrackDuration: Dispatch<SetStateAction<number>>,
) => {
	player
		.connect()
		.then((success: boolean) => {
			if (!success) {
				throw new Error("Failed to connect to Spotify player.");
			}
		})
		.catch((_: Error) => {
			throw new Error("Failed to connect to Spotify player.");
		});

	player.on("ready", (event: { device_id: string }) => {
		setDeviceId(event.device_id);
		setPlayer(player);
	});

	player.on("not_ready", (_: { device_id: string }) => {
		throw new Error("Device has gone offline unexpectedly.");
	});

	player.addListener(
		"player_state_changed",
		({ position, duration, paused }) => {
			setIsPaused(paused);
			setTrackPosition(position);
			setTrackDuration(duration);
		},
	);
};

export default PlayerSetup;
