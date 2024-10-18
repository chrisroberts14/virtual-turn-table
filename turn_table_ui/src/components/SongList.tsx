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
import type React from "react";
import type { SetStateAction } from "react";
import { useEffect, useState } from "react";

const SongList = (props: {
	songList: Song[];
	setCurrentSong: React.Dispatch<SetStateAction<Song | null>>;
}) => {
	const [selectedKey, setSelectedKey] = useState(new Set());

	const handleSelectionChange = (keys: Selection) => {
		if (keys === "all") {
			// Handle "all" selection case if needed, but for single selection, this shouldn't occur
			return;
		}
		setSelectedKey(new Set(keys)); // Update the selected key with the new Set
	};

	useEffect(() => {
		if (selectedKey.size > 1) {
			console.log("Error more than one song selected...");
		} else if (selectedKey.size < 1) {
			props.setCurrentSong(null);
		} else {
			const newSongIndex = props.songList.findIndex(
				(song) => song.title === selectedKey.values().next().value,
			);
			props.setCurrentSong(props.songList[newSongIndex]);
		}
	}, [selectedKey, props.songList, props.setCurrentSong]);

	return (
		<div>
			<Table
				isStriped
				selectionMode="single"
				aria-label="Song list"
				onSelectionChange={handleSelectionChange}
			>
				<TableHeader>
					<TableColumn key="title">Title</TableColumn>
					<TableColumn key="artists">Artists</TableColumn>
				</TableHeader>
				<TableBody items={props.songList}>
					{(item: Song) => (
						<TableRow key={item.title}>
							{(columnKey) => (
								<TableCell>{getKeyValue(item, columnKey)}</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};

export default SongList;
