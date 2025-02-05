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
} from "@heroui/table";
import type { Key } from "@react-types/shared";
import { useEffect, useState } from "react";

const SongList = () => {
	const { currentAlbum } = useMusic();
	const { currentSong, setCurrentSong, setTrackDuration, setIsPaused } =
		useSongControl();
	const [selectedKey, setSelectedKey] = useState<Set<Key>>(
		currentSong ? new Set([currentSong.title]) : new Set(),
	);

	const handleSelectionChange = (keys: Set<Key>) => {
		if (keys.size === 0) {
			setCurrentSong(null);
			setTrackDuration(0);
		} else {
			const song = currentAlbum?.songs.find(
				(song) => song.title === keys.values().next().value,
			);
			if (song) {
				setCurrentSong(song);
				setTrackDuration(song.duration_ms);
			}
		}
	};

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
			onSelectionChange={(keys) => handleSelectionChange(new Set(keys))}
			selectedKeys={selectedKey}
			className="z-30"
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
