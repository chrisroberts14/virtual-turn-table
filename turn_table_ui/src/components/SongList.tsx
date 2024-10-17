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
import type React from "react";
import type { SetStateAction } from "react";

const SongList = (props: {
	songList: Song[];
	setCurrentSong: React.Dispatch<SetStateAction<Song | null>>;
}) => {
	return (
		<div>
			<Table
				isStriped
				selectionMode="single"
				defaultSelectedKeys="secondary"
				aria-label="Song list"
			>
				<TableHeader>
					<TableColumn key="title">Title</TableColumn>
					<TableColumn key="artists">Artists</TableColumn>
				</TableHeader>
				<TableBody items={props.songList}>
					{(item) => (
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
