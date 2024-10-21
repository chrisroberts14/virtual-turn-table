import { useError } from "@/contexts/ErrorContext.tsx";
import type Song from "@/interfaces/Song.tsx";
import { Slider, type SliderValue } from "@nextui-org/slider";
import { useEffect, useState } from "react";

const TrackScrubber = (props: {
	player: SpotifyPlayer;
	trackPosition: number;
	trackDuration: number;
	currentSong: Song | null;
	deviceId: string;
}) => {
	const [position, setPosition] = useState(props.trackPosition);
	const { showError } = useError();

	useEffect(() => {
		setPosition(props.trackPosition);
	}, [props.trackPosition]);

	useEffect(() => {
		setInterval(async () => {
			if (!props.player || !props.currentSong) {
				return;
			}
			props.player
				.getCurrentState()
				.then((state) => {
					setPosition(state.position);
				})
				.catch((err) => {
					showError(`Failed to get current state: ${err}`);
				});
		}, 1000);
	}, [props.player, props.currentSong, showError]);

	const handleChange = (value: SliderValue) => {
		if (props.player) {
			const newPosition = Number(value);
			setPosition(newPosition);
			props.player.seek(newPosition).then((_) => {
				return;
			});
		}
	};

	const formatTime = (sliderValue: SliderValue) => {
		const time = Number(sliderValue);
		const currentMinutes: string = Math.floor(time / 60000).toLocaleString(
			"en-US",
			{ minimumIntegerDigits: 2, useGrouping: false },
		);
		const currentSeconds: string = Math.floor(
			(time % 60000) / 1000,
		).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
		const durationMinutes: string = Math.floor(
			props.trackDuration / 60000,
		).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
		const durationSeconds: string = Math.floor(
			(props.trackDuration % 60000) / 1000,
		).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
		return `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;
	};

	return (
		<Slider
			label={"Track Position"}
			maxValue={props.trackDuration}
			minValue={0}
			defaultValue={0}
			className="max-w-full pl-5 pr-5"
			value={position}
			getValue={formatTime}
			onChange={handleChange}
		/>
	);
};

export default TrackScrubber;
