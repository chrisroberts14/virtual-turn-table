import PlayTrack from "@/api_calls/PlayTrack.tsx";
import PlayerSetup from "@/api_calls/PlayerSetup.tsx";
import { useMusic } from "@/contexts/MusicContext.tsx";
import { useNavigation } from "@/contexts/NavigationContext.tsx";
import { useSpotifyToken } from "@/contexts/SpotifyTokenContext.tsx";
import type Song from "@/interfaces/Song.tsx";
import {
	type StateData,
	getStateData,
	storeStateData,
} from "@/interfaces/StateData.tsx";
import { useEffect, useState } from "react";

// Music player hook

const useMusicPlayer = () => {
	const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
	const [deviceId, setDeviceId] = useState("");
	const [isPlayerReady, setIsPlayerReady] = useState(false);
	const [currentSong, setCurrentSong] = useState<Song | null>(null);
	const [nextSong, setNextSong] = useState<Song | null>(null);
	const [isPaused, setIsPaused] = useState(true);
	const [trackPosition, setTrackPosition] = useState(0); // In ms
	const [trackDuration, setTrackDuration] = useState(0);
	const { token } = useSpotifyToken();
	const { currentAlbum, setCurrentAlbum } = useMusic();
	const { currentPage } = useNavigation();

	useEffect(() => {
		// Get the state data and set the current song
		const state = getStateData();
		if (state) {
			setCurrentSongAndAlbum(state);
		}
	}, []);

	const setCurrentSongAndAlbum = (state: StateData) => {
		if (state.currentAlbum) {
			setCurrentAlbum(state.currentAlbum);
		}
		if (state.currentSong) {
			setCurrentSong(state.currentSong);
			setTrackDuration(state.currentSong.duration_ms);
		}
	};

	useEffect(() => {
		// Only create the player once the token is available
		if (token && !player) {
			// Add the spotify player script to the page
			const script = document.createElement("script");
			script.src = "https://sdk.scdn.co/spotify-player.js";
			script.async = true;
			document.body.appendChild(script);

			window.onSpotifyWebPlaybackSDKReady = async () => {
				const player = new window.Spotify.Player({
					name: "Vinyl Scanner",
					getOAuthToken: (cb: (token: string) => void) => {
						cb(token as string);
					},
					volume: 0.5,
				});
				PlayerSetup(player, setIsPlayerReady, setTrackPosition)
					.then(() => {
						setIsPlayerReady(true);
						player.on("ready", (event: { device_id: string }) => {
							setDeviceId(event.device_id);
							setPlayer(player);

							// Set up a polling function ot set the current track position
							setInterval(async () => {
								const state = await player.getCurrentState();
								if (state) {
									setTrackPosition(state.position);
									if (state.paused !== isPaused) {
										setIsPaused(state.paused);
									}
									if (
										state.position >= state.duration - 1000 &&
										!state.paused &&
										currentAlbum
									) {
										// If at the end of the song skip to the next one
										const currentSongIndex = currentAlbum.songs.findIndex(
											(song) =>
												song.title === state.track_window.current_track.name,
										);
										setCurrentSong(currentAlbum.songs[currentSongIndex + 1]);
									}
								}
							}, 500);
						});
					})
					.catch((error) => {
						console.error(error.message);
					});
			};
		}
	}, [token, player, currentAlbum, isPaused]);

	useEffect(() => {
		// If the current album changes, set the current song to the first song on the album
		// Only do that if the player is ready
		// If there is no current album or the player isn't ready then set the current song to null
		if (currentAlbum) {
			storeStateData({
				currentAlbum: currentAlbum,
				currentSong: undefined,
			});
		}
		if (currentAlbum && isPlayerReady) {
			setCurrentSong(currentAlbum.songs[0]);
			setNextSong(currentAlbum.songs[1]);
		} else {
			setCurrentSong(null);
			setNextSong(null);
			setTrackPosition(0);
			setTrackDuration(0);
			setIsPaused(true);
		}
	}, [currentAlbum, isPlayerReady]);

	useEffect(() => {
		// Set the next song when the current song changes
		if (currentAlbum && currentSong) {
			const currentSongIndex = currentAlbum.songs.findIndex(
				(song) => song.title === currentSong.title,
			);
			if (currentSongIndex < currentAlbum.songs.length - 1) {
				setNextSong(currentAlbum.songs[currentSongIndex + 1]);
			} else {
				setNextSong(null);
			}
		}
	}, [currentSong, currentAlbum]);

	useEffect(() => {
		// Play the current track when the current song changes
		if (token && currentSong) {
			PlayTrack(token, currentSong.uri, deviceId)
				.then(() => {
					setTrackDuration(currentSong.duration_ms);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [currentSong, token, deviceId]);

	useEffect(() => {
		if (currentPage !== 0 && player) {
			// 0 is the play page
			// Pause if not on the play page
			player.pause();
		} else if (player) {
			// Play if on the play page
			player.resume();
		}
	}, [currentPage, player]);

	return {
		player,
		setPlayer,
		deviceId,
		setDeviceId,
		isPlayerReady,
		setIsPlayerReady,
		currentSong,
		setCurrentSong,
		nextSong,
		setNextSong,
		isPaused,
		setIsPaused,
		trackPosition,
		setTrackPosition,
		trackDuration,
		setTrackDuration,
	};
};

export default useMusicPlayer;
