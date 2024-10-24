import { useSongControl } from "@/contexts/SongControlContext.tsx";
import { Slider, type SliderValue } from "@nextui-org/slider";

const TrackScrubber = () => {
	const { player, trackPosition, trackDuration, isPlayerReady } =
		useSongControl();

	const handleChange = (value: SliderValue) => {
		if (player && isPlayerReady) {
			const newPosition = Number(value);
			player.seek(newPosition).then((_) => {
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
			trackDuration / 60000,
		).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
		const durationSeconds: string = Math.floor(
			(trackDuration % 60000) / 1000,
		).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
		return `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;
	};

	return (
		<Slider
			label={"Track Position"}
			maxValue={trackDuration}
			minValue={0}
			defaultValue={0}
			className="max-w-full pl-5 pr-5"
			value={trackPosition}
			getValue={formatTime}
			onChange={handleChange}
		/>
	);
};

export default TrackScrubber;
