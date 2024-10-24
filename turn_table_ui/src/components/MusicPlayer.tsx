import PlayTrack from "@/api_calls/PlayTrack.tsx";
import PlayerSetup from "@/api_calls/PlayerSetup.tsx";
import PlayingAlbum from "@/components/PlayingAlbum.tsx";
import SongControls from "@/components/SongControls.tsx";
import SongList from "@/components/SongList.tsx";
import SpinningVinyl from "@/components/SpinningVinyl.tsx";
import VolumeScrubber from "@/components/VolumeScrubber.tsx";
import { useError } from "@/contexts/ErrorContext.tsx";
import { useMusic } from "@/contexts/MusicContext.tsx";
import { SongControlContext } from "@/contexts/SongControlContext.tsx";
import { useSpotifyToken } from "@/contexts/SpotifyTokenContext.tsx";
import type Song from "@/interfaces/Song.tsx";
import {
	type StateData,
	getStateData,
	storeStateData,
} from "@/interfaces/StateData.tsx";
import { Resizable } from "re-resizable";
import { useCallback, useEffect, useState } from "react";

const MusicPlayer = () => {
	const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
	const [deviceId, setDeviceId] = useState("");
	const [currentSong, setCurrentSong] = useState<Song | null>(null);
	const [nextSong, setNextSong] = useState<Song | null>(null);
	const [isPaused, setIsPaused] = useState(true);
	const [trackPosition, setTrackPosition] = useState(0); // In ms
	const [trackDuration, setTrackDuration] = useState(0);
	const [contentHeight, setContentHeight] = useState(window.innerHeight - 240);
	const { showError } = useError();
	const { token } = useSpotifyToken();
	const { currentAlbum, setCurrentAlbum } = useMusic();
	const [isPlayerReady, setIsPlayerReady] = useState(false);

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

	const playerCreation = useCallback(
		(spotifyPlayer: SpotifyPlayer) => {
			if (spotifyPlayer) {
				PlayerSetup(
					spotifyPlayer,
					setDeviceId,
					setPlayer,
					setIsPlayerReady,
					setTrackPosition,
					setCurrentSong,
					currentAlbum,
					setIsPaused,
				)
					.then(() => {
						return;
					})
					.catch((error) => {
						console.error(error.message);
					});
			}
		},
		[currentAlbum],
	);

	useEffect(() => {
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
				playerCreation(player);
			};
		}
	}, [token, player, playerCreation]);

	useEffect(() => {
		if (currentAlbum) {
			storeStateData({
				currentAlbum: currentAlbum,
			});
		}
		if (currentSong && currentAlbum && token && deviceId && isPlayerReady) {
			storeStateData({
				currentSong: currentSong,
			});

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
	}, [currentSong, currentAlbum, token, deviceId, isPlayerReady]);

	const playTrackWithHandling = async () => {
		if (currentSong && currentAlbum && token && deviceId) {
			PlayTrack(token, currentSong.uri, deviceId).catch((error) => {
				showError(error.message);
			});
			setTrackDuration(currentSong.duration_ms);
		}
	};

	const onResize = () => {
		setContentHeight(window.innerHeight - 240);
	};

	window.addEventListener("resize", onResize);

	return (
		<div className="flex flex-col h-full">
			<SongControlContext.Provider
				value={{
					isPaused,
					setIsPaused,
					currentSong,
					setCurrentSong,
					deviceId,
					setDeviceId,
					player,
					setPlayer,
					trackPosition,
					setTrackPosition,
					trackDuration,
					setTrackDuration,
					nextSong,
					setNextSong,
					isPlayerReady,
					setIsPlayerReady,
				}}
			>
				<Resizable
					defaultSize={{ width: "100%", height: contentHeight }}
					maxHeight={contentHeight}
					minHeight={contentHeight}
					onResize={onResize}
					enable={{
						top: false,
						right: false,
						bottom: false,
						left: false,
						topRight: false,
						bottomRight: false,
						bottomLeft: false,
						topLeft: false,
					}}
				>
					<div className="flex flex-row h-full">
						<div className="animate-slideRight overflow-y-auto overflow-x-hidden max-w-[50%] bg-content1">
							{currentAlbum ? (
								<Resizable
									enable={{
										top: false,
										right: true,
										bottom: false,
										left: false,
										topRight: false,
										bottomRight: false,
										bottomLeft: false,
										topLeft: false,
									}}
									maxHeight={contentHeight}
								>
									<div className="overflow-y-auto h-full max-w-full">
										<SongList />
									</div>
								</Resizable>
							) : null}
						</div>
						<div className="flex justify-center items-center bg-gray-700 flex-grow">
							<SpinningVinyl isPaused={isPaused} />
						</div>
					</div>
				</Resizable>
				<div className="flex-grow bg-gray-900 flex justify-center pt-2 pl-2 w-screen h-full">
					{player && currentAlbum ? (
						<div className="flex flex-row justify-center w-screen">
							<div>
								<PlayingAlbum />
							</div>
							<div className="flex-[2]">
								<SongControls />
							</div>
							<div>
								<VolumeScrubber />
							</div>
						</div>
					) : (
						<div className="flex flex-row justify-center w-screen h-full" />
					)}
				</div>
			</SongControlContext.Provider>
		</div>
	);
};

export default MusicPlayer;
