import AlbumDisplay from "@/components/AlbumDisplay.tsx";
import SongDetails from "@/components/SongDetails.tsx";
import TrackList from "@/components/TrackList.tsx";
import TrackScrubber from "@/components/TrackScrubber.tsx";
import VolumeScrubber from "@/components/VolumeScrubber.tsx";
import type Album from "@/interfaces/Album.tsx";
import type Song from "@/interfaces/Song.tsx";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
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

	useEffect(() => {
		if (currentSong) {
			axios
				.post(`${import.meta.env.VITE_BFF_ADDRESS}play_track/`, null, {
					params: {
						spotify_access_token: props.token,
						track_uri: currentSong.uri,
						device_id: deviceId,
					},
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [currentSong, props.token, deviceId]);

	const pauseSong = async () => {
		if (player) {
			await player.pause();
			setIsPaused(true);
		}
	};

	const playSong = async () => {
		if (player) {
			await player.resume();
			setIsPaused(false);
		}
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Card className="min-w-[400px] max-w-[400px]">
				<CardBody className="flex gap-3">
					<>
						{currentAlbum ? (
							<AlbumDisplay currentAlbum={currentAlbum} />
						) : (
							<div>No album</div>
						)}
						{currentSong ? (
							<SongDetails currentSong={currentSong} />
						) : (
							<div>No song</div>
						)}
						<TrackScrubber
							player={player}
							trackPosition={trackPosition}
							trackDuration={trackDuration}
						/>
						<VolumeScrubber player={player} />
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								flexDirection: "row",
							}}
						>
							{isPaused ? (
								<Button onClick={playSong}>Play</Button>
							) : (
								<Button onClick={pauseSong}>Pause</Button>
							)}
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<TrackList songs={songs} setCurrentSong={setCurrentSong} />
						</div>
					</>
				</CardBody>
			</Card>
		</div>
	);
};

export default MusicPlayer;
