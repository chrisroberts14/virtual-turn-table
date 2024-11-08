import ShareCollection from "@/api_calls/ShareCollection.tsx";
import UserSelect from "@/components/UserSelect.tsx";
import { useError } from "@/contexts/ErrorContext.tsx";
import { useUsername } from "@/contexts/UsernameContext.tsx";
import { Button } from "@nextui-org/button";
import { Modal, ModalContent } from "@nextui-org/modal";
import { useState } from "react";

interface ShareModalProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
}

const ShareModal = ({ isOpen, setIsOpen }: ShareModalProps) => {
	const [inputValue, setInputValue] = useState("");
	const { username } = useUsername();
	const { showError } = useError();

	const handleShare = () => {
		if (!inputValue || !username) {
			return;
		}
		setIsOpen(false);
		// Share the users collection
		ShareCollection(username, inputValue).catch(() => {
			showError("Failed to share collection");
		});
		setInputValue("");
	};

	return (
		<Modal
			className="bg-gray-600"
			backdrop="blur"
			isOpen={isOpen}
			placement="top-center"
			onClose={() => {
				setIsOpen(false);
			}}
		>
			<ModalContent>
				<div className="justify-center w-full text-center space-y-2 p-2">
					<h1 className="w-full text-center font-bold pb-2">Share</h1>
					<UserSelect inputValue={inputValue} setInputValue={setInputValue} />
					<Button
						className="bg-primary font-bold text-white"
						onClick={handleShare}
						disabled={!inputValue}
					>
						Share
					</Button>
				</div>
			</ModalContent>
		</Modal>
	);
};

export default ShareModal;
