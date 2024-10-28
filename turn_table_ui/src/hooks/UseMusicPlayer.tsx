import PlayTrack from "@/api_calls/PlayTrack.tsx";
import PlayerSetup from "@/api_calls/PlayerSetup.tsx";
import { useError } from "@/contexts/ErrorContext.tsx";
import { useMusic } from "@/contexts/MusicContext.tsx";
import { useSpotifyToken } from "@/contexts/SpotifyTokenContext.tsx";
import type Song from "@/interfaces/Song.tsx";
import {
	type StateData,
	getStateData,
	storeStateData,
} from "@/interfaces/StateData.tsx";
import { useEffect, useState } from "react";

const useMusicPlayer = () => {
	const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
	const [deviceId, setDeviceId] = useState("");
	const [isPlayerReady, setIsPlayerReady] = useState(false);
	const [currentSong, setCurrentSong] = useState<Song | null>(null);
	const [nextSong, setNextSong] = useState<Song | null>(null);
	const [isPaused, setIsPaused] = useState(true);
	const [trackPosition, setTrackPosition] = useState(0); // In ms
	const [trackDuration, setTrackDuration] = useState(0);
	const { showError } = useError();
	const { token } = useSpotifyToken();
	const { currentAlbum, setCurrentAlbum } = useMusic();

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
				setPlayer(player);
				PlayerSetup(
					player,
					setDeviceId,
					setPlayer,
					setIsPlayerReady,
					setTrackPosition,
					setCurrentSong,
					currentAlbum,
				)
					.then(() => {
						setIsPlayerReady(true);
					})
					.catch((error) => {
						console.error(error.message);
					});
			};
		}
	}, [token, player, currentAlbum]);

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
		if (currentAlbum && isPlayerReady && currentSong) {
			const currentSongIndex = currentAlbum.songs.findIndex(
				(song) => song.title === currentSong.title,
			);
			if (currentSongIndex < currentAlbum.songs.length - 1) {
				setNextSong(currentAlbum.songs[currentSongIndex + 1]);
			} else {
				setNextSong(null);
			}
			playTrackWithHandling().then(() => {
				return;
			});
		}
	}, [currentSong, currentAlbum, isPlayerReady]);

	const playTrackWithHandling = async () => {
		if (currentSong && currentAlbum && token && deviceId) {
			PlayTrack(token, currentSong.uri, deviceId).catch((error) => {
				showError(error.message);
			});
			setTrackDuration(currentSong.duration_ms);
		}
	};

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
