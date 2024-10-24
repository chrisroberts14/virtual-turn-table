import type Album from "@/interfaces/Album.tsx";
import type Song from "@/interfaces/Song.tsx";
import type { Dispatch, SetStateAction } from "react";
const PlayerSetup = async (
	player: SpotifyPlayer,
	setDeviceId: Dispatch<SetStateAction<string>>,
	setPlayer: Dispatch<SetStateAction<SpotifyPlayer | null>>,
	setIsPlayerReady: Dispatch<SetStateAction<boolean>>,
	setTrackPosition: Dispatch<SetStateAction<number>>,
	setCurrentSong: Dispatch<SetStateAction<Song | null>>,
	currentAlbum: Album | null,
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
						if (
							state.position >= state.duration - 1000 &&
							!state.paused &&
							currentAlbum
						) {
							const currentSongIndex = currentAlbum.songs.findIndex(
								(song) => song.title === state.track_window.current_track.name,
							);
							setCurrentSong(currentAlbum.songs[currentSongIndex + 1]);
						}
					}
				}, 500);
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
				},
			);
		})
		.catch((_: Error) => {
			setIsPlayerReady(false);
			throw new Error("Failed to connect to Spotify player.");
		});
};

export default PlayerSetup;
