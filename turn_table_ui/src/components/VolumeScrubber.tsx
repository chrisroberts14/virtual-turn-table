import {Slider} from "@nextui-org/slider"
import {useState} from "react";

const VolumeScrubber = (props: {player: SpotifyPlayer | null}) => {
    const [volume, setVolume] = useState(0.5);


    const handleChange = (value: number | number[] ) => {
        if (Array.isArray(value)) {
            console.log("VolumeScrubber: value is an array");
            return;
        }
        if (props.player)
        {
            setVolume(value);
            props.player.setVolume(value).then(_ => {return;});
        }
    }

    return (
        <Slider
            label="Volume"
            size="sm"
            maxValue={1}
            minValue={0}
            defaultValue={0.5}
            step={0.01}
            className="max-w-sm"
            value={volume}
            onChange={handleChange}
        />
    );
}

export default VolumeScrubber;
