import PlayingAlbum from "@/components/PlayingAlbum.tsx";
import SongControls from "@/components/SongControls.tsx";
import SongList from "@/components/SongList.tsx";
import VolumeScrubber from "@/components/VolumeScrubber.tsx";
import type Album from "@/interfaces/Album.tsx";
import type Song from "@/interfaces/Song.tsx";
import axios from "axios";
import { Resizable } from "re-resizable";
import { useEffect, useState } from "react";

const MusicPlayer = (props: { token: string | null; album: Album | null }) => {
	const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
	const [deviceId, setDeviceId] = useState("");
	// const [isConnected, setIsConnected] = useState(false);
	const [songs, setSongs] = useState<Song[]>([]);
	const [currentSong, setCurrentSong] = useState<Song | null>(null);
	const [nextSong, setNextSong] = useState<Song | null>(null);
	const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
	const [isPaused, setIsPaused] = useState(false);
	const [trackPosition, setTrackPosition] = useState(0); // In ms
	const [trackDuration, setTrackDuration] = useState(0);
	const [contentHeight, setContentHeight] = useState(window.innerHeight - 240);

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
			player.connect().then((success: boolean) => {
				if (success) {
					//setIsConnected(true);
				} else {
					// TODO: ADD ERROR MESSAGE ON FRONTEND
					//setIsConnected(false);
				}
			});

			player.on("ready", (event: { device_id: string }) => {
				setDeviceId(event.device_id);
				setPlayer(player);
			});

			player.on("not_ready", (event: { device_id: string }) => {
				console.log("Device ID has gone offline:", event.device_id);
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
	}, [props.token]);

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
					});
				})
				.catch((error) => {
					console.log(error);
				});

			axios
				.get(`${import.meta.env.VITE_BFF_ADDRESS}get_songs_in_album/`, {
					params: {
						spotify_access_token: props.token,
						album_uri: props.album.album_uri,
					},
				})
				.then((response) => {
					setSongs(
						response.data.map((song: Song) => ({
							title: song.title,
							artists: song.artists,
							uri: song.uri,
							album_uri: song.album_uri,
						})),
					);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [props.album, props.token]);

	useEffect(() => {
		if (currentSong) {
			const currentSongIndex = songs.findIndex(
				(song) => song.title === currentSong.title,
			);
			if (currentSongIndex < songs.length - 1) {
				setNextSong(songs[currentSongIndex + 1]);
			}

			axios
				.post(`${import.meta.env.VITE_BFF_ADDRESS}play_track/`, {
					spotify_access_token: props.token,
					track_uri: currentSong.uri,
					device_id: deviceId,
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [currentSong, songs, props.token, deviceId]);

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
					<div className="animate-slideRight">
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
							>
								<div className="overflow-y-auto h-full">
									<SongList songList={songs} setCurrentSong={setCurrentSong} />
								</div>
							</Resizable>
						) : null}
					</div>
					<div className="flex">Spinning Vinyl</div>
				</div>
			</Resizable>
			<div className="flex-grow bg-primary-100 flex justify-center pt-2 pl-2 w-screen h-full">
				{player ? (
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
								songList={songs}
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
