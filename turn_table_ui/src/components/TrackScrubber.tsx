import {Slider} from "@nextui-org/slider"
import {useEffect, useState} from "react";

// @ts-ignore
const TrackScrubber = ({player, trackPosition, trackDuration}) => {
    const [position, setPosition] = useState(trackPosition);

    useEffect(() => {
        setPosition(trackPosition);
    }, [trackPosition]);

    const handleChange = (value: any) => {
        const newPosition = Number(value);
        setPosition(newPosition);
        player.seek(newPosition);
    }

    return (
        <Slider
            label={"Track Position"}
            maxValue={trackDuration}
            minValue={0}
            defaultValue={0}
            className="max-w-md"
            value={position}
            onChange={handleChange}
        />
    );
}

export default TrackScrubber;
