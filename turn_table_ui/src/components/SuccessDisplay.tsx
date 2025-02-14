import { useSuccess } from "@/contexts/SuccessContext.tsx";
import { Alert } from "@heroui/alert";
import { useEffect, useState } from "react";

const SuccessDisplay = () => {
	const { success, clearSuccess } = useSuccess();
	const [show, setShow] = useState(false);

	useEffect(() => {
		if (success) {
			setShow(true);
			setTimeout(() => {
				setShow(false);
				clearSuccess();
			}, 5000);
		}
	}, [success, clearSuccess]);

	if (!success) {
		return null;
	}

	return (
		<div
			// This container centers its children & transitions the opacity
			className={`
        fixed
        top-[25%]
        left-0
        right-0
        flex
        justify-center
        transition-opacity
        duration-300
        ${show ? "opacity-100" : "opacity-0"}
      `}
			style={{ pointerEvents: show ? "auto" : "none" }}
		>
			<div className="mx-auto w-1/2">
				<Alert
					title="Success"
					variant="solid"
					description={success}
					color="success"
					onClose={clearSuccess}
				/>
			</div>
		</div>
	);
};

export default SuccessDisplay;
