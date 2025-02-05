import { useSongControl } from "@/contexts/SongControlContext.tsx";
import { Card, CardBody } from "@heroui/card";

const SongDetails = () => {
	const { currentSong } = useSongControl();

	return (
		<Card
			isBlurred={true}
			className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
			shadow="sm"
		>
			<CardBody>
				<div className="flex flex-col items-center justify-center">
					<h1>{currentSong?.title}</h1>
					<h2>{currentSong?.artists}</h2>
				</div>
			</CardBody>
		</Card>
	);
};

export default SongDetails;
