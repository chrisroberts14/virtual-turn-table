import type Song from "@/interfaces/Song.tsx";
import { Card, CardBody } from "@nextui-org/card";

const SongDetails = (props: { currentSong: Song }) => {
	return (
		<Card
			isBlurred={true}
			className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
			shadow="sm"
		>
			<CardBody>
				<div className="flex flex-col items-center justify-center">
					<h1>{props.currentSong.title}</h1>
					<h2>{props.currentSong.artists}</h2>
				</div>
			</CardBody>
		</Card>
	);
};

export default SongDetails;
