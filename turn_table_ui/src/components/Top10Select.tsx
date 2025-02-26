import AddAlbum from "@/api_calls/AddAlbum.ts";
import { useBFFToken } from "@/contexts/BFFTokenContext.ts";
import { useMusic } from "@/contexts/MusicContext.tsx";
import { useUpload } from "@/contexts/UploadContext.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";

const Top10Select = () => {
	const {
		top10,
		setScannedAlbum,
		setFadeConfirm,
		fadeConfirm,
		setCurrentImage,
	} = useUpload();
	const { setCurrentAlbum } = useMusic();
	const { BFFToken } = useBFFToken();

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
		if (BFFToken && album) {
			AddAlbum(BFFToken, album.album_uri).catch((error) => {
				console.error(error);
			});
		}
		setScannedAlbum(null);
		setCurrentImage(null);
	};

	const triggerConfirmSlide = () => {
		setFadeConfirm(!fadeConfirm);
	};

	const rejectAll = () => {
		triggerConfirmSlide();
		setScannedAlbum(null);
		setCurrentImage(null);
	};

	return (
		<div className="h-full">
			<h1 className="w-full font-bold text-center pb-4">Best Matches</h1>
			<div className="flex flex-wrap gap-2 justify-center overflow-x-auto h-[70%]">
				{uniqueItems.map((album: Album) => (
					<div
						key={album.album_uri}
						className="relative transition duration-300 hover:scale-110"
						style={{ height: 125 }}
						onClick={() => {
							handleClick(album);
						}}
						onKeyDown={() => {
							handleClick(album);
						}}
					>
						<Image
							title={album.title}
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
			<div className="w-full flex items-center justify-center flex-col pt-3">
				<Button
					style={{ background: "#8c0606" }}
					className="w-[25%]"
					onPress={rejectAll}
				>
					Reject all
				</Button>
			</div>
		</div>
	);
};

export default Top10Select;
