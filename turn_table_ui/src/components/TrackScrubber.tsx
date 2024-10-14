import {Slider} from "@nextui-org/slider"
import {useEffect, useState} from "react";

const TrackScrubber = (props: {player: SpotifyPlayer | null, trackPosition: number, trackDuration: number}) => {
    const [position, setPosition] = useState(props.trackPosition);

    useEffect(() => {
        setPosition(props.trackPosition);
    }, [props.trackPosition]);

    useEffect(() => {
        setInterval(async () => {
            if (!props.player) {return;}
            const state = await props.player.getCurrentState();
            if (state) {
                setPosition(state.position);
            }
        }, 1000);
    }, [props.player]);

    const handleChange = (value: any) => {
        if (props.player) {
            const newPosition = Number(value);
            setPosition(newPosition);
            props.player.seek(newPosition).then(_ => {return;});
        }
    }

    const formatTime = (time: number) => {
        const currentMinutes: String = Math.floor(time / 60000).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
        const currentSeconds: String = Math.floor((time % 60000) / 1000).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
        const durationMinutes: String = Math.floor(props.trackDuration / 60000).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
        const durationSeconds: String = Math.floor((props.trackDuration % 60000) / 1000).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
        return `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;
    }

    return (
        <Slider
            label={"Track Position"}
            maxValue={props.trackDuration}
            minValue={0}
            defaultValue={0}
            className="max-w-md"
            value={position}
            getValue={formatTime}
            onChange={handleChange}
        />
    );
}

export default TrackScrubber;
