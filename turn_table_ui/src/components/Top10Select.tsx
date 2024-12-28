import AddAlbum from "@/api_calls/AddAlbum.ts";
import { useMusic } from "@/contexts/MusicContext.tsx";
import { useUpload } from "@/contexts/UploadContext.tsx";
import { useUsername } from "@/contexts/UsernameContext.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Image } from "@nextui-org/image";

const Top10Select = () => {
	const {
		top10,
		setScannedAlbum,
		setFadeConfirm,
		fadeConfirm,
		setCurrentImage,
	} = useUpload();
	const { username } = useUsername();
	const { setCurrentAlbum } = useMusic();

	const uniqueItems = [];
	const seenTitles = new Set();

	for (const item of top10) {
		if (!seenTitles.has(item.album_uri)) {
			seenTitles.add(item.album_uri);
			uniqueItems.push(item);
		}
	}

	const handleClick = (album: Album) => {
		triggerConfirmSlide();
		setCurrentAlbum(album);
		if (username && album) {
			AddAlbum(username, album.album_uri).catch((error) => {
				console.error(error);
			});
		}
		setScannedAlbum(null);
		setCurrentImage(null);
	};

	const triggerConfirmSlide = () => {
		setFadeConfirm(!fadeConfirm);
	};

	return (
		<div className="h-full">
			<h1 className="w-full font-bold text-center pb-4">Best Matches</h1>
			<div className="flex flex-wrap gap-2 justify-center overflow-x-auto h-[80%]">
				{uniqueItems.map((album: Album) => (
					<div
						key={album.album_uri}
						className="relative transition duration-300 hover:scale-110"
						style={{ height: 125 }}
						onPress={() => {
							handleClick(album);
						}}
						onKeyDown={() => {
							handleClick(album);
						}}
					>
						<Image
							src={album.image_url}
							width={125}
							className="aspect-square object-cover transition duration-3000 hover:blur-sm"
						/>
						<div className="text-center absolute z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 transition duration-300 hover:opacity-100">
							{album.title}
							<br />
							{album.artists}
						</div>
					</div>
				))}
			</div>
			<div className="flex">
				<span className="w-full font-bold text-center">
					If none of these match your album please take a new image...
				</span>
			</div>
		</div>
	);
};

export default Top10Select;
