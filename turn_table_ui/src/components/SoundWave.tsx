import { useEffect, useState } from "react";

const SoundWave = () => {
	const [bars, setBars] = useState(Array(100).fill(50));

	useEffect(() => {
		const interval = setInterval(() => {
			// Update each bar height smoothly
			setBars(bars.map(() => Math.floor(Math.random() * 100))); // Random heights from 20% to 100%
		}, 300); // Adjust the interval to control the speed

		return () => clearInterval(interval);
	}, [bars]);

	return (
		<div className="flex justify-center items-center h-24 w-full space-x-1 overflow-hidden bg-gray-900">
			{bars.map((height) => (
				<div
					key={height}
					className="bg-green-500 w-1 transition-all duration-500 ease-in-out"
					style={{ height: `${height}%` }}
				/>
			))}
		</div>
	);
};

export default SoundWave;
