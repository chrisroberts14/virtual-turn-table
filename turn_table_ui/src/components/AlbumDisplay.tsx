import type Album from "@/interfaces/Album.tsx";
import { Image } from "@nextui-org/image";

const AlbumDisplay = (props: { currentAlbum: Album }) => {
	return (
		<Image
			className={"rounded-lg h-full"}
			src={props.currentAlbum.image_url}
			alt="album cover"
			shadow="md"
		/>
	);
};

export default AlbumDisplay;
