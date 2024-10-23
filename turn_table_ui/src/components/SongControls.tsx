import TrackScrubber from "@/components/TrackScrubber.tsx";
import { useMusic } from "@/contexts/MusicContext.tsx";
import { useSongControl } from "@/contexts/SongControlContext.tsx";
import type Song from "@/interfaces/Song.tsx";
import { Button } from "@nextui-org/button";
import { Tab, Tabs } from "@nextui-org/tabs";
import { FaPause, FaPlay } from "react-icons/fa";
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";

const SongControls = () => {
	const {
		player,
		isPaused,
		setIsPaused,
		currentSong,
		setCurrentSong,
		isPlayerReady,
		setTrackDuration,
	} = useSongControl();
	const { currentAlbum } = useMusic();

	const pauseSong = async () => {
		if (player && isPlayerReady) {
			await player.pause();
			setIsPaused(true);
		}
	};

	const playSong = async () => {
		if (player && isPlayerReady) {
			await player.resume();
			setIsPaused(false);
		}
	};

	const nextSong = () => {
		if (player && currentAlbum && isPlayerReady) {
			const currentSongIndex = currentAlbum.songs.findIndex(
				(song: Song) => song.title === currentSong?.title,
			);
			if (currentSongIndex < currentAlbum.songs.length - 1) {
				setCurrentSong(currentAlbum.songs[currentSongIndex + 1]);
				setTrackDuration(currentAlbum.songs[currentSongIndex + 1].duration_ms);
			}
		}
	};

	const prevSong = () => {
		if (player && currentAlbum && isPlayerReady) {
			const currentSongIndex = currentAlbum.songs.findIndex(
				(song: Song) => song.title === currentSong?.title,
			);
			if (currentSongIndex > 0) {
				setCurrentSong(currentAlbum.songs[currentSongIndex - 1]);
				setTrackDuration(currentAlbum.songs[currentSongIndex - 1].duration_ms);
			}
		}
	};

	return (
		<div className={"flex flex-col min-w-96 p-2"}>
			<div className={"flex flex-row justify-center"}>
				<Button onClick={prevSong}>
					<RxTrackPrevious />
				</Button>
				{!isPaused ? (
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
				<TrackScrubber />
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
