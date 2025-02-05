import type Album from "@/interfaces/Album.tsx";
import { Image } from "@heroui/image";
import { Skeleton } from "@heroui/skeleton";

const AlbumDisplay = (props: { album: Album | null }) => {
	return (
		<div>
			{props.album ? (
				<Image
					className={"rounded-lg h-full"}
					src={props.album.image_url}
					alt="album cover"
					shadow="md"
				/>
			) : (
				<Skeleton
					style={{ width: "100%", paddingBottom: "100%" }}
					className="rounded-lg"
				>
					<div />
				</Skeleton>
			)}
		</div>
	);
};

export default AlbumDisplay;
