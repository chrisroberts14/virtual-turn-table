import {Card, CardBody} from "@nextui-org/card";
import Song from "@/interfaces/Song.tsx";

const SongDetails = (props: { currentSong: Song }) => {

    return (
        <Card
            isBlurred
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
}

export default SongDetails;
