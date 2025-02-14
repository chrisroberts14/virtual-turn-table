import { useError } from "@/contexts/ErrorContext.tsx";
import { Alert } from "@heroui/alert";
import { useEffect, useState } from "react";

const ErrorDisplay = () => {
	const { error, clearError } = useError();
	const [showError, setShowError] = useState<boolean>(false);

	useEffect(() => {
		if (error) {
			setShowError(true);
		} else {
			setShowError(false);
		}
	}, [error]);

	if (!error) {
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
        ${showError ? "opacity-100" : "opacity-0"}
      `}
			style={{ pointerEvents: showError ? "auto" : "none" }}
		>
			<div className="mx-auto w-1/2">
				<Alert
					title="Error"
					variant="solid"
					description={error}
					color="danger"
					onClose={clearError}
					closeButtonProps={{
						title: "close",
					}}
				/>
			</div>
		</div>
	);
};

export default ErrorDisplay;
