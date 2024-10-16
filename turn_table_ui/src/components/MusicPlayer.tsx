import PlayingAlbum from "@/components/PlayingAlbum.tsx";
import SongControls from "@/components/SongControls.tsx";
import VolumeScrubber from "@/components/VolumeScrubber.tsx";
import type Album from "@/interfaces/Album.tsx";
import type Song from "@/interfaces/Song.tsx";
import axios from "axios";
import { useEffect, useState } from "react";

const MusicPlayer = (props: {
	token: string | null;
	albumURI: string | null;
}) => {
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
			});

			player.addListener(
				"player_state_changed",
				({ position, duration, paused }) => {
					setIsPaused(paused);
					setTrackPosition(position);
					setTrackDuration(duration);
				},
			);

			setPlayer(player);
		};
	}, [props.token]);

	useEffect(() => {
		if (props.albumURI) {
			axios
				.get(`${import.meta.env.VITE_BFF_ADDRESS}album_details/`, {
					params: {
						spotify_access_token: localStorage.getItem("spotify_access_token"),
						album_uri: props.albumURI,
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
						album_uri: props.albumURI,
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
	}, [props.albumURI, props.token]);

	return (
		<>
			<div className="flex-grow bg-gray-200 p-4 overflow-auto">
				<div className="flex flex-row flex-wrap justify-center h-full" />
			</div>
			<div className="bg-gray-800 text-white p-2 text-center h-44">
				{player ? (
					<div className="flex flex-row justify-center">
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
							/>
						</div>
						<div>
							<VolumeScrubber player={player} />
						</div>
					</div>
				) : null}
			</div>
		</>
	);
};

export default MusicPlayer;
