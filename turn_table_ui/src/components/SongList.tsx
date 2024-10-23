import { useError } from "@/contexts/ErrorContext.tsx";
import { useMusic } from "@/contexts/MusicContext.tsx";
import { useSongControl } from "@/contexts/SongControlContext.tsx";
import type Song from "@/interfaces/Song.tsx";
import {
	type Selection,
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
	const { currentSong, setCurrentSong, setIsPaused } = useSongControl();
	const [selectedKey, setSelectedKey] = useState<Set<Key>>(
		currentSong ? new Set([currentSong.title]) : new Set(),
	);
	const { showError } = useError();

	const handleSelectionChange = (keys: Selection) => {
		if (keys === "all") {
			// Handle "all" selection case if needed, but for single selection, this shouldn't occur
			return;
		}
		setSelectedKey(new Set(keys)); // Update the selected key with the new Set
	};

	useEffect(() => {
		if (selectedKey.size > 1) {
			showError("Error more than one song selected...");
		} else if (selectedKey.size < 1) {
			setCurrentSong(null);
			setIsPaused(true);
		} else {
			if (currentAlbum) {
				const newSongIndex = currentAlbum.songs.findIndex(
					(song) => song.title === selectedKey.values().next().value,
				);
				setCurrentSong(currentAlbum.songs[newSongIndex]);
				setIsPaused(false);
			}
		}
	}, [selectedKey, currentAlbum, setCurrentSong, showError, setIsPaused]);

	return (
		<Table
			isStriped
			selectionMode="single"
			aria-label="Song list"
			onSelectionChange={handleSelectionChange}
			selectedKeys={selectedKey}
		>
			<TableHeader>
				<TableColumn key="title">Title</TableColumn>
				<TableColumn key="artists">Artists</TableColumn>
			</TableHeader>
			<TableBody items={currentAlbum?.songs}>
				{(item: Song) => (
					<TableRow key={item.title}>
						{(columnKey) => (
							<TableCell>{getKeyValue(item, columnKey)}</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

export default SongList;
