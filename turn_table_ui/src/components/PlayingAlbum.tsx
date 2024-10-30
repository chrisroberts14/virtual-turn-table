import { useMusic } from "@/contexts/MusicContext.tsx";
import { useSongControl } from "@/contexts/SongControlContext.tsx";
import { Card, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";
import { Skeleton } from "@nextui-org/skeleton";

const PlayingAlbum = () => {
	const { currentAlbum } = useMusic();
	const { currentSong, nextSong } = useSongControl();

	return (
		<div className={"flex flex-row items-center"}>
			{currentAlbum ? (
				<Image
					style={{ width: "10em", height: "10em" }}
					className="rounded-lg"
					src={currentAlbum.image_url}
					alt="album cover"
				/>
			) : (
				<Skeleton
					style={{ width: "10em", height: "10em" }}
					className="rounded-lg"
				/>
			)}

			{currentAlbum ? (
				<div className={"flex flex-col pl-2 justify-center"}>
					<p className="text-[0.7rem]">Currently Playing:</p>
					<Card>
						<CardBody className="max-h-16">
							<p className="text-[0.75rem]">
								{currentSong ? currentSong.title : "No song selected"}
							</p>
							<p className="text-[0.75rem]">
								{currentSong ? `By ${currentSong.artists}` : ""}
							</p>
						</CardBody>
						<Divider />
						<CardBody className="max-h-16">
							<p className="text-[0.75rem]">{nextSong ? nextSong.title : ""}</p>
							<p className="text-[0.75rem]">
								{nextSong ? `By ${nextSong.artists}` : ""}
							</p>
						</CardBody>
					</Card>
					<p className="text-[0.7rem]">Is up next...</p>
				</div>
			) : (
				<div className={"flex flex-col pl-2 justify-center"}>
					<p className="text-[0.7rem]">Currently Playing:</p>
					<Card>
						<CardBody className="max-h-16">
							<Skeleton style={{ width: "8em", height: "2em" }} />
						</CardBody>
						<Divider />
						<CardBody className="max-h-16">
							<Skeleton style={{ width: "8em", height: "2em" }} />
						</CardBody>
					</Card>
					<p className="text-[0.7rem]">Is up next...</p>
				</div>
			)}
		</div>
	);
};

export default PlayingAlbum;
