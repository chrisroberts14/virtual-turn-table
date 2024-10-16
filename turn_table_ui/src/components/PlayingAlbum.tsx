import type Album from "@/interfaces/Album.tsx";
import type Song from "@/interfaces/Song.tsx";
import { Card, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";

const PlayingAlbum = (props: {
	currentAlbum: Album | null;
	currentSong: Song | null;
	nextSong: Song | null;
}) => {
	return (
		<div className={"flex flex-row items-center"}>
			{props.currentAlbum ? (
				<Image
					style={{ width: "10em", height: "10em" }}
					className="rounded-lg"
					src={props.currentAlbum.image_url}
					alt="album cover"
				/>
			) : (
				<div>No Album</div>
			)}

			{props.currentAlbum ? (
				<div className={"flex flex-col pl-2 justify-center"}>
					<p className="text-[0.7rem]">Currently Playing:</p>
					<Card>
						<CardBody className="max-h-16">
							<p className="text-[0.75rem]">
								{props.currentSong
									? props.currentSong.title
									: "No song selected"}
							</p>
							<p className="text-[0.75rem]">
								{props.currentSong ? `By ${props.currentSong.artists}` : ""}
							</p>
						</CardBody>
						<Divider />
						<CardBody className="max-h-16">
							<p className="text-[0.75rem]">
								{props.nextSong ? props.nextSong.title : ""}
							</p>
							<p className="text-[0.75rem]">
								{props.nextSong ? `By ${props.nextSong.artists}` : ""}
							</p>
						</CardBody>
					</Card>
					<p className="text-[0.7rem]">Is up next...</p>
				</div>
			) : null}
		</div>
	);
};

export default PlayingAlbum;
