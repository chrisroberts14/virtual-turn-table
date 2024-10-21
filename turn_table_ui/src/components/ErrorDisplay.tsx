import { useError } from "@/contexts/ErrorContext.tsx";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent } from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

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
		<>
			{showError && (
				<Modal
					onClose={clearError}
					placement="center"
					isOpen={showError}
					closeButton={
						<Button size="sm" isIconOnly color="danger" variant="solid">
							<IoMdClose />
						</Button>
					}
					classNames={{
						body: "bg-red-300",
					}}
				>
					<ModalContent>
						<ModalBody>
							<div className="text-center">
								<h1 className="text-2xl font-bold text-white">Error</h1>
								<p className="rounded-lg border-2">{error}</p>
							</div>
						</ModalBody>
					</ModalContent>
				</Modal>
			)}
		</>
	);
};

export default ErrorDisplay;
