import { useState } from "react";

const SpeakerWaves = (props: { rotation: number }) => {
	const [waves] = useState(Array(5).fill(5));
	// Create keys which are "Wave - n" where n is the index of the bar
	const keys = Array(5)
		.fill(0)
		.map((_, i) => `Wave - ${i} - ${props.rotation}`);

	return (
		<div
			className={`flex h-full justify-center items-center space-x-[7%] rotate-${props.rotation}`}
		>
			{waves.map((_, index) => (
				<div
					key={keys[index]}
					className="bg-green-500 rounded-2xl"
					style={{ height: `${(index + 1) * 5}%`, width: `${100 / 12}%` }}
				/>
			))}
		</div>
	);
};

export default SpeakerWaves;
