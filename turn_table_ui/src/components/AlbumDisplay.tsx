import {Card, CardBody} from "@nextui-org/card";
import {Image} from "@nextui-org/image";
import Album from "@/interfaces/Album.tsx";

const AlbumDisplay = (props: { currentAlbum: Album}) => {
    return (
        <Card
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
            shadow="sm"
        >
            <CardBody>
                <div className="flex flex-col items-center justify-center">
                <Image
                    src={props.currentAlbum.image_url}
                    alt="album cover"
                    shadow="md">
                </Image>
                </div>
            </CardBody>
        </Card>
    );
}

export default AlbumDisplay;
