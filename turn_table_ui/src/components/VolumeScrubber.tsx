import { useError } from "@/contexts/ErrorContext.tsx";
import { Slider, type SliderValue } from "@nextui-org/slider";
import { useState } from "react";

const VolumeScrubber = (props: { player: SpotifyPlayer | null }) => {
	const [volume, setVolume] = useState(0.5);
	const { showError } = useError();

	const handleChange = (value: number | number[]) => {
		if (Array.isArray(value)) {
			showError("VolumeScrubber: value is an array");
			return;
		}
		if (props.player) {
			setVolume(value);
			props.player.setVolume(value).then((_) => {
				return;
			});
		}
	};

	return (
		<Slider
			label="Volume"
			size="sm"
			maxValue={1}
			minValue={0}
			defaultValue={0.5}
			step={0.01}
			orientation="vertical"
			className="h-44 p-2"
			value={volume}
			getValue={(value: SliderValue) =>
				`${Math.round(Number(value) * 100).toString()}%`
			}
			onChange={handleChange}
		/>
	);
};

export default VolumeScrubber;
