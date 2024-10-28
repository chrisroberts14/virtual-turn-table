import { useSongControl } from "@/contexts/SongControlContext.tsx";
import { Slider, type SliderValue } from "@nextui-org/slider";
import { useState } from "react";

const VolumeScrubber = () => {
	const [volume, setVolume] = useState(0.5);
	const { player } = useSongControl();

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
			onChange={(value) => {
				if (!Array.isArray(value)) {
					setVolume(value);
					player?.setVolume(value);
				}
			}}
			title="Volume"
		/>
	);
};

export default VolumeScrubber;
