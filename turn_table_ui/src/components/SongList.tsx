import { useMusic } from "@/contexts/MusicContext.tsx";
import { useSongControl } from "@/contexts/SongControlContext.tsx";
import type Song from "@/interfaces/Song.tsx";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	getKeyValue,
} from "@nextui-org/table";
import type { Key } from "@react-types/shared";
import { useEffect, useState } from "react";

const SongList = () => {
	const { currentAlbum } = useMusic();
	const { currentSong, setCurrentSong, setTrackDuration, setIsPaused } =
		useSongControl();
	const [selectedKey, setSelectedKey] = useState<Set<Key>>(
		currentSong ? new Set([currentSong.title]) : new Set(),
	);

	useEffect(() => {
		if (selectedKey.size < 1) {
			setCurrentSong(null);
			setTrackDuration(0);
		} else {
			if (currentAlbum) {
				const newSongIndex = currentAlbum.songs.findIndex(
					(song) => song.title === selectedKey.values().next().value,
				);
				setCurrentSong(currentAlbum.songs[newSongIndex]);
				if (newSongIndex !== -1) {
					setTrackDuration(currentAlbum.songs[newSongIndex].duration_ms);
				}
			}
		}
	}, [selectedKey, currentAlbum, setCurrentSong, setTrackDuration]);

	useEffect(() => {
		// Update the selected item in the list
		setIsPaused(false);
		if (currentSong) {
			setSelectedKey(new Set([currentSong.title]));
		} else {
			setSelectedKey(new Set());
		}
	}, [currentSong, setIsPaused]);

	return (
		<Table
			isStriped
			selectionMode="single"
			aria-label="Song list"
			onSelectionChange={(keys) => setSelectedKey(new Set(keys))}
			selectedKeys={selectedKey}
		>
			<TableHeader>
				<TableColumn key="title">Title</TableColumn>
				<TableColumn key="artists">Artists</TableColumn>
			</TableHeader>
			<TableBody items={currentAlbum?.songs}>
				{(item: Song) => (
					<TableRow key={item.title} title={item.title}>
						{(columnKey) => (
							<TableCell>
								{columnKey === "artists"
									? item.artists.join(", ")
									: getKeyValue(item, columnKey)}
							</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

export default SongList;
