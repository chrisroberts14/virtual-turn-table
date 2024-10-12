import {Card, CardBody} from "@nextui-org/card";

const SongDetails = (props: { song: string | undefined,
    artist: string | undefined; }) => {

    return (
        <Card
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
            shadow="sm"
        >
            <CardBody>
                <div className="flex flex-col items-center justify-center">
                    <h1>{props.song}</h1>
                    <h2>{props.artist}</h2>
                </div>
            </CardBody>
        </Card>
    );
}

export default SongDetails;
