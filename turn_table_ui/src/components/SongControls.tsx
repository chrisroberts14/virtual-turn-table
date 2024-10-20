import TrackScrubber from "@/components/TrackScrubber.tsx";
import type Song from "@/interfaces/Song.tsx";
import { Button } from "@nextui-org/button";
import { Tab, Tabs } from "@nextui-org/tabs";
import type React from "react";
import type { SetStateAction } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";

const SongControls = (props: {
	player: SpotifyPlayer;
	trackPosition: number;
	trackDuration: number;
	isPaused: boolean;
	setIsPaused: React.Dispatch<SetStateAction<boolean>>;
	songList: Song[];
	currentSong: Song | null;
	setCurrentSong: React.Dispatch<SetStateAction<Song | null>>;
	deviceId: string;
}) => {
	const pauseSong = async () => {
		if (props.player) {
			await props.player.pause();
			props.setIsPaused(true);
		}
	};

	const playSong = async () => {
		if (props.player) {
			await props.player.resume();
			props.setIsPaused(false);
		}
	};

	const nextSong = () => {
		if (props.player) {
			const currentSongIndex = props.songList.findIndex(
				(song) => song.title === props.currentSong?.title,
			);
			if (currentSongIndex < props.songList.length - 1) {
				props.setCurrentSong(props.songList[currentSongIndex + 1]);
			}
		}
	};

	const prevSong = () => {
		if (props.player) {
			const currentSongIndex = props.songList.findIndex(
				(song) => song.title === props.currentSong?.title,
			);
			if (currentSongIndex > 0) {
				props.setCurrentSong(props.songList[currentSongIndex - 1]);
			}
		}
	};

	return (
		<div className={"flex flex-col min-w-96 p-2"}>
			<div className={"flex flex-row justify-center"}>
				<Button onClick={prevSong}>
					<RxTrackPrevious />
				</Button>
				{!props.isPaused ? (
					<Button onClick={pauseSong}>
						<FaPause />
					</Button>
				) : (
					<Button onClick={playSong}>
						<FaPlay />
					</Button>
				)}
				<Button onClick={nextSong}>
					<RxTrackNext />
				</Button>
			</div>
			<div className={"flex flex-row justify-center"}>
				<TrackScrubber
					player={props.player}
					trackPosition={props.trackPosition}
					trackDuration={props.trackDuration}
					currentSong={props.currentSong}
					deviceId={props.deviceId}
				/>
			</div>
			<div className={"flex flex-row justify-center"}>
				<Tabs aria-label="Track or Album Controls">
					<Tab key="track" title="Track" />
					<Tab key="album" title="Album" />
				</Tabs>
			</div>
		</div>
	);
};

export default SongControls;
