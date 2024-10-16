import type Song from "@/interfaces/Song.tsx";
import { Button } from "@nextui-org/button";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	getKeyValue,
} from "@nextui-org/table";
import React, { type SetStateAction } from "react";

const SongList = (props: {
	songList: Song[];
	setCurrentSong: React.Dispatch<SetStateAction<Song | null>>;
}) => {
	const bottomContent = React.useMemo(() => {
		return (
			<div className="flex justify-center">
				<Button>Load More</Button>
			</div>
		);
	}, []);

	return (
		<div>
			<Table
				bottomContent={bottomContent}
				bottomContentPlacement="outside"
				isStriped
				selectionMode="single"
				defaultSelectedKeys="secondary"
				aria-label="Song list"
				className="overflow-y-scroll max-h-fit"
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
