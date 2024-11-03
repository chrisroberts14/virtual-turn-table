import TrackScrubber from "@/components/TrackScrubber.tsx";
import { useMusic } from "@/contexts/MusicContext.tsx";
import { useSongControl } from "@/contexts/SongControlContext.tsx";
import type Song from "@/interfaces/Song.tsx";
import { Button } from "@nextui-org/button";
import { FaPause, FaPlay } from "react-icons/fa";
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";

const SongControls = () => {
	const {
		player,
		isPaused,
		currentSong,
		setCurrentSong,
		isPlayerReady,
		setTrackDuration,
		setIsPaused,
	} = useSongControl();
	const { currentAlbum } = useMusic();

	const togglePlayPause = async () => {
		if (player && isPlayerReady) {
			await player.togglePlay();
			setIsPaused(!isPaused);
		}
	};

	const nextSong = () => {
		if (player && currentAlbum && isPlayerReady) {
			const currentSongIndex = currentAlbum.songs.findIndex(
				(song: Song) => song.title === currentSong?.title,
			);
			if (currentSongIndex < currentAlbum.songs.length - 1) {
				setIsPaused(false);
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
				setIsPaused(false);
				setCurrentSong(currentAlbum.songs[currentSongIndex - 1]);
				setTrackDuration(currentAlbum.songs[currentSongIndex - 1].duration_ms);
			}
		}
	};

	return (
		<div className="flex flex-col p-2 z-30 pt-10" title="Song Controls">
			<div className="flex flex-row justify-center space-x-2">
				<Button
					onClick={prevSong}
					isDisabled={!currentSong}
					title="Previous Track"
					isIconOnly
				>
					<RxTrackPrevious />
				</Button>
				<Button
					onClick={togglePlayPause}
					isDisabled={!currentSong}
					title="Play/Pause"
				>
					{isPaused ? <FaPlay /> : <FaPause />}
				</Button>
				<Button
					onClick={nextSong}
					isDisabled={!currentSong}
					title="Next Track"
					isIconOnly
				>
					<RxTrackNext />
				</Button>
			</div>
			<div className={"flex flex-row justify-center"}>
				<TrackScrubber />
			</div>
		</div>
	);
};

export default SongControls;
