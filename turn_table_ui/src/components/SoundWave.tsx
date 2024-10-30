import { useEffect, useState } from "react";

const SoundWave = () => {
	const [bars, setBars] = useState(Array(100).fill(50));
	// Create keys which are "Bar - n" where n is the index of the bar
	const keys = Array(100)
		.fill(0)
		.map((_, i) => `Bar - ${i}`);

	useEffect(() => {
		const interval = setInterval(() => {
			setBars(bars.map(() => Math.floor(Math.random() * 100)));
		}, 300);

		return () => clearInterval(interval);
	}, [bars]);

	return (
		<div className="flex justify-center items-center h-24 w-full space-x-1 overflow-hidden bg-gray-900">
			{bars.map((height, index) => (
				<div
					key={keys[index]}
					className="bg-green-500 w-1 transition-all duration-500 ease-in-out"
					style={{ height: `${height}%` }}
				/>
			))}
		</div>
	);
};

export default SoundWave;
