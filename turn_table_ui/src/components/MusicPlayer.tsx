import PlayingAlbum from "@/components/PlayingAlbum.tsx";
import SongControls from "@/components/SongControls.tsx";
import SongList from "@/components/SongList.tsx";
import SpinningVinyl from "@/components/SpinningVinyl.tsx";
import VolumeScrubber from "@/components/VolumeScrubber.tsx";
import { useError } from "@/contexts/ErrorContext.tsx";
import type Album from "@/interfaces/Album.tsx";
import type Song from "@/interfaces/Song.tsx";
import { getStateData, storeStateData } from "@/interfaces/StateData.tsx";
import axios from "axios";
import { Resizable } from "re-resizable";
import { useEffect, useState } from "react";

const MusicPlayer = (props: { token: string | null; album: Album | null }) => {
	const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
	const [deviceId, setDeviceId] = useState("");
	// const [isConnected, setIsConnected] = useState(false);
	const [currentSong, setCurrentSong] = useState<Song | null>(null);
	const [nextSong, setNextSong] = useState<Song | null>(null);
	const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
	const [isPaused, setIsPaused] = useState(true);
	const [trackPosition, setTrackPosition] = useState(0); // In ms
	const [trackDuration, setTrackDuration] = useState(0);
	const [contentHeight, setContentHeight] = useState(window.innerHeight - 240);
	const { showError } = useError();

	useEffect(() => {
		// Get the state data and set the current song
		const state = getStateData();
		if (state) {
			if (state.currentAlbum) {
				setCurrentAlbum(state.currentAlbum);
			}
			if (state.currentSong) {
				setCurrentSong(state.currentSong);
			}
		}
	}, []);

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;
		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = async () => {
			const player = new window.Spotify.Player({
				name: "Vinyl Scanner",
				getOAuthToken: (cb: (token: string) => void) => {
					cb(props.token as string);
				},
				volume: 0.5,
			});
			player
				.connect()
				.then((success: boolean) => {
					if (!success) {
						showError("Failed to connect to Spotify player.");
					}
				})
				.catch((_) => {
					showError("Failed to connect to Spotify player.");
				});

			player.on("ready", (event: { device_id: string }) => {
				setDeviceId(event.device_id);
				setPlayer(player);
			});

			player.on("not_ready", (_: { device_id: string }) => {
				showError("Device has gone offline unexpectedly.");
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
	}, [props.token, showError]);

	useEffect(() => {
		if (props.album && props.token) {
			axios
				.get(`${import.meta.env.VITE_BFF_ADDRESS}album_details/`, {
					params: {
						spotify_access_token: props.token,
						album_uri: props.album.album_uri,
					},
				})
				.then((response) => {
					const album: Album = response.data;
					setCurrentAlbum({
						title: album.title,
						artists: album.artists,
						image_url: album.image_url,
						album_uri: album.album_uri,
						tracks_url: album.tracks_url,
						songs: album.songs,
					});
				})
				.catch((error) => {
					showError(error.response.data.message);
				});
		}
	}, [props.album, props.token, showError]);

	useEffect(() => {
		if (currentAlbum) {
			storeStateData({
				currentAlbum: currentAlbum,
			});
		}
		if (currentSong && currentAlbum) {
			storeStateData({
				currentSong: currentSong,
			});

			const currentSongIndex = currentAlbum.songs.findIndex(
				(song) => song.title === currentSong.title,
			);
			if (currentSongIndex < currentAlbum.songs.length - 1) {
				setNextSong(currentAlbum.songs[currentSongIndex + 1]);
			}

			axios
				.post(`${import.meta.env.VITE_BFF_ADDRESS}play_track/`, {
					spotify_access_token: props.token,
					track_uri: currentSong.uri,
					device_id: deviceId,
				})
				.catch((error) => {
					if (error.response) {
						showError(error.response.message);
					}
				});
		}
	}, [currentSong, currentAlbum, props.token, deviceId, showError]);

	const onResize = () => {
		setContentHeight(window.innerHeight - 240);
	};

	window.addEventListener("resize", onResize);

	return (
		<div className="flex flex-col h-full">
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
									<SongList
										songList={currentAlbum.songs}
										currentSong={currentSong}
										setCurrentSong={setCurrentSong}
									/>
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
							<PlayingAlbum
								currentAlbum={currentAlbum}
								currentSong={currentSong}
								nextSong={nextSong}
							/>
						</div>
						<div className="flex-[2]">
							<SongControls
								player={player}
								trackPosition={trackPosition}
								trackDuration={trackDuration}
								isPaused={isPaused}
								setIsPaused={setIsPaused}
								currentSong={currentSong}
								songList={currentAlbum.songs}
								setCurrentSong={setCurrentSong}
								deviceId={deviceId}
							/>
						</div>
						<div>
							<VolumeScrubber player={player} />
						</div>
					</div>
				) : (
					<div className="flex flex-row justify-center w-screen h-full" />
				)}
			</div>
		</div>
	);
};

export default MusicPlayer;
