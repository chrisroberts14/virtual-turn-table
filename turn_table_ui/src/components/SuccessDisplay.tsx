import { useSuccess } from "@/contexts/SuccessContext.tsx";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent } from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

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
		<>
			{show && (
				<Modal
					onClose={clearSuccess}
					placement="center"
					isOpen={show}
					closeButton={
						<Button
							size="sm"
							isIconOnly
							color="danger"
							variant="solid"
							title="close"
						>
							<IoMdClose />
						</Button>
					}
					classNames={{
						body: "bg-green-300",
					}}
				>
					<ModalContent>
						<ModalBody>
							<div className="text-center">
								<h1 className="text-2xl font-bold text-white">Success</h1>
								<p className="rounded-lg border-2">{success}</p>
							</div>
						</ModalBody>
					</ModalContent>
				</Modal>
			)}
		</>
	);
};

export default SuccessDisplay;
