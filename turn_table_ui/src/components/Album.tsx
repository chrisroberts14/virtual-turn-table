import {Card, CardBody} from "@nextui-org/card";
import {Image} from "@nextui-org/image";

const Album = (props: { img_url: string | undefined,
    artist: string | undefined, title: string | undefined; }) => {

    return (
        <Card
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
            shadow="sm"
        >
            <CardBody>
                <div className="flex flex-col items-center justify-center">
                <Image
                    src={props.img_url}
                    alt="album cover"
                    shadow="md">
                </Image>
                </div>
            </CardBody>
        </Card>
    );
}

export default Album;
