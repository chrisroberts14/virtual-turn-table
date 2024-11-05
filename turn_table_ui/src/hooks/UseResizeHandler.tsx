import { useEffect, useState } from "react";

// Hook used to handle resizing of the window

const useResizeHandler = (offset: number) => {
	const [contentHeight, setContentHeight] = useState(
		window.innerHeight - offset,
	);

	useEffect(() => {
		const handleResize = () => setContentHeight(window.innerHeight - offset);

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [offset]);

	return contentHeight;
};

export default useResizeHandler;
