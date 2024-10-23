import type { Dispatch, SetStateAction } from "react";
const PlayerSetup = async (
	player: SpotifyPlayer,
	setDeviceId: Dispatch<SetStateAction<string>>,
	setPlayer: Dispatch<SetStateAction<SpotifyPlayer | null>>,
	setIsPlayerReady: Dispatch<SetStateAction<boolean>>,
	setTrackPosition: Dispatch<SetStateAction<number>>,
	setTrackDuration: Dispatch<SetStateAction<number>>,
) => {
	let intervalId: NodeJS.Timeout | null = null;

	player
		.connect()
		.then((success: boolean) => {
			if (!success) {
				throw new Error("Failed to connect to Spotify player.");
			}
			player.on("ready", (event: { device_id: string }) => {
				setDeviceId(event.device_id);
				setPlayer(player);
				setIsPlayerReady(true);
				console.log("Player is ready.");
				intervalId = setInterval(async () => {
					const state = await player.getCurrentState();
					if (state) {
						setTrackPosition(state.position);
						console.log("Player state updated.");
					}
				}, 1000);
			});

			player.on("not_ready", (_: { device_id: string }) => {
				setIsPlayerReady(false);
				clearInterval(intervalId as NodeJS.Timeout);
				throw new Error("Device has gone offline unexpectedly.");
			});

			player.on(
				"player_state_changed",
				(state: { position: number; duration: number; paused: boolean }) => {
					setTrackPosition(state.position);
					setTrackDuration(state.duration);
				},
			);
		})
		.catch((_: Error) => {
			setIsPlayerReady(false);
			throw new Error("Failed to connect to Spotify player.");
		});
};

export default PlayerSetup;
